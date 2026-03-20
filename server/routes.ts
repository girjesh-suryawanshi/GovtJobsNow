import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, searchJobsSchema, adminLoginSchema, processUrlSchema, userLoginSchema, userRegisterSchema, adminPasswordChangeSchema, createAdminUserSchema, updateJobSchema, insertExamSchema } from "@shared/schema";
import { scrapeJobs } from "./scraper";
import { adminStorage } from "./admin-storage";
import { urlProcessor } from "./url-processor";
import { requireAdminAuth, createAdminSession, verifyPassword, revokeAdminSession } from "./admin-auth";
import { createUserSession, hashPassword, verifyPassword as verifyUserPassword, requireUserAuth, revokeUserSession } from "./user-auth";
import { hashPassword as hashAdminPassword } from "./admin-auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Visitor Tracking Middleware
  app.use(async (req, res, next) => {
    // Only track non-API and non-static asset requests to avoid over-counting
    if (req.method === "GET" && 
        !req.path.startsWith("/api") && 
        !req.path.startsWith("/uploads") && 
        !req.path.includes(".")) {
      
      try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
        const userAgent = req.headers["user-agent"] || "";
        const ipHash = crypto.createHash("sha256").update(`${ip}-${userAgent}`).digest("hex");
        
        // Manual cookie parsing since cookie-parser might not be installed
        const cookies = req.headers.cookie || "";
        const hasVisitorCookie = cookies.split(";").some(c => c.trim().startsWith("gj_visitor="));
        
        const isNewSession = !hasVisitorCookie;
        
        if (isNewSession) {
          // Set a long-lived cookie (1 month)
          res.cookie("gj_visitor", ipHash, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/" });
          await storage.recordVisitor(ipHash, true);
        } else {
          await storage.recordVisitor(ipHash, false);
        }
      } catch (error) {
        console.error("Visitor tracking error:", error);
      }
    }
    next();
  });

  // Serve strict robots.txt for AdSense & generic bots
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: https://govtjobsnow.com/sitemap.xml

User-agent: Mediapartners-Google
Allow: /`);
  });

  // Setup Multer for PDF/Image Notification Uploads
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'notification-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storageConfig,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // Serve the uploads directory statically
  app.use("/uploads", express.static(uploadDir));

  // File Upload Endpoint
  // @ts-ignore
  app.post("/api/upload", upload.single("file"), (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: "File upload failed", error });
    }
  });

  // Serve dynamic sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const allJobs = await storage.getAllJobs();

      const baseUrl = "https://govtjobsnow.com";

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Add static routes
      const staticRoutes = ["", "/exams", "/about-us", "/contact", "/faq", "/privacy-policy", "/terms-of-service", "/disclaimer", "/jobs/ssc", "/jobs/railway"];
      for (const route of staticRoutes) {
        xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
      }

      // Add Job routes
      for (const job of allJobs) {
        const lastMod = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        xml += `  <url>\n    <loc>${baseUrl}/job/${job.id}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      // Convert string parameters to appropriate types
      const processedQuery: any = { ...req.query };

      if (processedQuery.page && typeof processedQuery.page === 'string') {
        processedQuery.page = parseInt(processedQuery.page);
      }
      if (processedQuery.limit && typeof processedQuery.limit === 'string') {
        processedQuery.limit = parseInt(processedQuery.limit);
      }

      const params = searchJobsSchema.parse(processedQuery);
      const result = await storage.searchJobs(params);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters", error });
    }
  });

  // Get single job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Increment view count asynchronously
      storage.incrementJobViewCount(req.params.id).catch(err => {
        console.error("Error incrementing job view count:", err);
      });

      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job", error });
    }
  });

  // Get related jobs
  app.get("/api/jobs/:id/related", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      const related = await storage.getRelatedJobs(job.id, job.jobCategory || undefined, job.department, 4);
      res.json(related);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related jobs", error });
    }
  });

  // Get trending jobs
  app.get("/api/jobs/trending", async (req, res) => {
    try {
      const trending = await storage.getTrendingJobs(5);
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending jobs", error });
    }
  });

  // Get job positions for a specific job
  app.get("/api/jobs/:id/positions", async (req, res) => {
    try {
      const positions = await storage.getJobPositions(req.params.id);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job positions", error });
    }
  });

  // Create new job (admin only)
  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ message: "Invalid job data", error });
    }
  });

  // Update job (admin only)
  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const jobData = insertJobSchema.partial().parse(req.body);
      const job = await storage.updateJob(req.params.id, jobData);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(400).json({ message: "Invalid job data", error });
    }
  });

  // Delete job (admin only)
  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteJob(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete job", error });
    }
  });

  // Get job statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getJobStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats", error });
    }
  });

  // Public visitor stats for footer
  app.get("/api/visitor-stats", async (req, res) => {
    try {
      const stats = await storage.getVisitorStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visitor stats", error });
    }
  });

  // ======== EXAM ROUTES ========

  // Get all exams
  app.get("/api/exams", async (req, res) => {
    try {
      const exams = await storage.getAllExams();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exams", error });
    }
  });

  // Get single exam by ID
  app.get("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.getExam(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exam", error });
    }
  });

  // Create new exam (admin only)
  app.post("/api/admin/exams", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const examData = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ message: "Invalid exam data", error });
    }
  });

  // Update exam (admin only)
  app.put("/api/admin/exams/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const examData = insertExamSchema.partial().parse(req.body);
      const exam = await storage.updateExam(req.params.id, examData);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(400).json({ message: "Invalid exam data", error });
    }
  });

  // Delete exam (admin only)
  app.delete("/api/admin/exams/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const success = await storage.deleteExam(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete exam", error });
    }
  });

  // Trigger job scraping
  app.post("/api/scrape", async (req, res) => {
    try {
      const jobs = await scrapeJobs();
      // Store scraped jobs
      const createdJobs = [];
      for (const jobData of jobs) {
        try {
          const job = await storage.createJob(jobData);
          createdJobs.push(job);
        } catch (error) {
          console.error("Failed to create job:", error);
        }
      }
      res.json({
        message: `Successfully scraped and stored ${createdJobs.length} jobs`,
        jobs: createdJobs
      });
    } catch (error) {
      res.status(500).json({ message: "Scraping failed", error });
    }
  });

  // ========== ADMIN ROUTES ==========

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);

      const admin = await adminStorage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For demo purposes, use simple password comparison
      const isValidPassword = password === admin.password || await verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      await adminStorage.updateAdminLastLogin(admin.id);
      const token = createAdminSession(admin.id);

      res.json({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      revokeAdminSession(token);
    }
    res.json({ message: "Logged out successfully" });
  });

  // Get current admin user
  app.get("/api/admin/me", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const admin = await adminStorage.getAdminById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin data", error });
    }
  });

  // Get admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const stats = await adminStorage.getAdminDashboardStats(adminId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats", error });
    }
  });

  // Get all signup users (admin only)
  app.get("/api/admin/users", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({ id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, createdAt: u.createdAt })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error });
    }
  });

  // Delete signup user (admin only)
  app.delete("/api/admin/users/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user", error });
    }
  });

  // Get all admin users (admin only)
  app.get("/api/admin/admins", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const admins = await adminStorage.getAllAdminUsers();
      res.json(admins.map(a => ({ id: a.id, username: a.username, email: a.email, role: a.role, createdAt: a.createdAt })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admins", error });
    }
  });

  // Delete admin user (admin only)
  app.delete("/api/admin/admins/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const currentAdminId = requireAdminAuth(token);
    
    if (!currentAdminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Prevent deleting self
    if (currentAdminId === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    try {
      const success = await adminStorage.deleteAdminUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete admin", error });
    }
  });

  // Admin manual job creation
  // Gemini AI Job Extraction
  app.post("/api/admin/extract-job", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Raw text is required" });

    try {
      const { generateText } = await import("./gemini");
      const prompt = `Extract job details from the following text and return ONLY a JSON object compatible with the following schema.
      For fields with specific options, you MUST choose the closest matching option from the allowed list. If no exact match or the data is missing, return an empty string "" (never return null).
      
      ALLOWED OPTIONS:
      - department: "Staff Selection Commission", "Union Public Service Commission", "Railway Recruitment Board", "Banking Sector", "Defense Services", "Public Sector Undertaking", "State Government", "Police & Security Forces", "Education & Teaching", "Healthcare & Medical", "Other Government Department"
      - location: "All India", "Pan India", "India Wide", "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "State Wise", "Multiple Locations"
      - qualification: "10th Pass", "12th Pass", "ITI/Diploma", "Graduate (Any Stream)", "Post Graduate", "Engineering Degree", "Medical Degree", "Law Degree", "Management Degree", "Professional Qualification", "Experience Based"
      - jobCategory: "Central Government", "State Government", "PSU", "Banking", "Railway", "Defence", "Police", "Healthcare", "Education"
      - employmentType: "Permanent", "Contract", "Apprentice", "Temporary", "Part-time"
      - dates (applicationStartDate, deadline): Must strictly be in YYYY-MM-DD format.

      CRITICAL SEO INSTRUCTION:
      The "title" and "description" fields must NOT be exact copy-pastes from the source text. You must REWRITE them to be highly readable, attractive, and 100% unique human-written content to avoid Google SEO duplicate content penalties.
      - "title": Create a catchy, clear, and professional job title.
      - "description": Write a comprehensive, highly engaging, completely original summary of the job role, responsibilities, and key instructions in easy-to-read paragraphs. Do NOT just copy the source text sentences.
      
      SCHEMA:
      {
        "title": "Rewritten SEO Job Title",
        "department": "Department Name (Must be from allowed options)",
        "location": "Location (Must be from allowed options)",
        "qualification": "Required Qualification (Must be from allowed options)",
        "deadline": "YYYY-MM-DD",
        "salary": "Salary Details",
        "description": "Full Job Description",
        "applyLink": "https://example.com/apply",
        "positions": "1",
        "ageLimit": "Age Range",
        "applicationFee": "Fee Details",
        "selectionProcess": "Process Details",
        "experienceRequired": "Experience Level",
        "jobCategory": "Category (Must be from allowed options)",
        "employmentType": "Type (Must be from allowed options)",
        "recruitingOrganization": "Organization",
        "applicationStartDate": "YYYY-MM-DD",
        "vacancyBreakdown": "Breakdown Details",
        "useMultiplePositions": true/false (Set true if you detect multiple distinct positions with different qualifications/salaries),
        "jobPositions": [
          {
            "positionName": "Position Name",
            "qualification": "Required Qualification",
            "experienceRequired": "Experience Range",
            "salaryRange": "Salary Range",
            "numberOfVacancies": 1 (As number),
            "specificRequirements": "Any specific details"
          }
        ],
        "prepGuide": "A unique 100-150 word career preparation strategy for this specific role. Do NOT use generic text. Mention specific subjects or skills needed.",
        "syllabus": "A structured summary of the exam syllabus or key topics to study for this position."
      }
      
      Text: ${rawText}`;

      const response = await generateText(prompt);
      // Robust JSON cleaning to strip markdown and conversational text
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No JSON object found in response");
      }
      const jsonStr = match[0];

      const parsedData = JSON.parse(jsonStr);
      // Clean nulls to empty strings for UI components
      for (const key in parsedData) {
        if (parsedData[key] === null) parsedData[key] = "";
        if (typeof parsedData[key] === "number" && key !== "positions") {
          parsedData[key] = parsedData[key].toString();
        }
      }

      // Special handling for jobPositions if present
      if (parsedData.jobPositions && Array.isArray(parsedData.jobPositions)) {
        parsedData.jobPositions = parsedData.jobPositions.map((pos: any) => {
          const cleanedPos = { ...pos };
          for (const k in cleanedPos) {
            if (cleanedPos[k] === null) cleanedPos[k] = "";
          }
          return cleanedPos;
        });
        parsedData.useMultiplePositions = parsedData.jobPositions.length > 1;
      }

      res.json(parsedData);
    } catch (error) {
      console.error("Gemini extraction error:", error);
      res.status(500).json({ message: "Failed to extract job data" });
    }
  });

  // Gemini AI Exam Extraction
  app.post("/api/admin/extract-exam", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Raw text is required" });

    try {
      const { generateText } = await import("./gemini");
      const prompt = `Extract exam details from the following text and return ONLY a JSON object compatible with the following schema.
      For fields with specific options, you MUST choose the closest matching option from the allowed list. If no exact match or the data is missing, return an empty string "" (never return null).
      
      ALLOWED OPTIONS:
      - examMode: "Online", "Offline", "Both"
      - dates (registrationStartDate, registrationEndDate, examDate, admitCardDate, resultsDate): Must strictly be in YYYY-MM-DD format.

      CRITICAL SEO INSTRUCTION:
      The "title" and "syllabus" fields must NOT be exact copy-pastes from the source text. You must REWRITE them to be highly attractive and 100% unique human-written content to avoid Google SEO duplicate content penalties.
      - "title": Create a catchy, clear, and professional exam title.
      - "syllabus": Write a comprehensive, highly engaging, and original summary of the exam syllabus, topics, and structure in easy-to-read paragraphs.
      
      SCHEMA:
      {
        "title": "Rewritten SEO Exam Title",
        "conductingOrganization": "Organization Name",
        "registrationStartDate": "YYYY-MM-DD",
        "registrationEndDate": "YYYY-MM-DD",
        "examDate": "YYYY-MM-DD",
        "admitCardDate": "YYYY-MM-DD",
        "resultsDate": "YYYY-MM-DD",
        "examPattern": "Pattern Details",
        "examMode": "Mode (Must be from allowed options)",
        "duration": "Duration (e.g., 60 minutes)",
        "totalMarks": "Total Marks (e.g., 100)",
        "location": "Location",
        "applicationFee": "Fee Details",
        "languagesAvailable": "Languages",
        "eligibility": "Eligibility Criteria",
        "officialWebsite": "https://example.com/apply",
        "syllabus": "Syllabus Details"
      }
      
      Text: \${rawText}`;

      const response = await generateText(prompt);
      // Robust JSON cleaning to strip markdown and conversational text
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No JSON object found in response");
      }
      const jsonStr = match[0];

      const parsedData = JSON.parse(jsonStr);
      // Clean nulls to empty strings for UI components
      for (const key in parsedData) {
        if (parsedData[key] === null) parsedData[key] = "";
        if (typeof parsedData[key] === "number") parsedData[key] = parsedData[key].toString();
      }

      res.json(parsedData);
    } catch (error) {
      console.error("Gemini extraction error:", error);
      res.status(500).json({ message: "Failed to extract exam data" });
    }
  });

  // Fetch URL HTML and return cleaned text payload for AI
  app.post("/api/admin/scrape-url", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { url } = req.body;
    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ message: "Valid URL is required" });
    }

    try {
      // Import cheerio dynamically so we don't bloat initial boot if not running scrapers
      const cheerio = await import("cheerio");

      // Set user-agent to avoid basic anti-bot blockers on gov sites
      const scrapeRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        }
      });

      if (!scrapeRes.ok) {
        throw new Error(`Server responded with ${scrapeRes.status}: ${scrapeRes.statusText}`);
      }

      const html = await scrapeRes.text();

      // Load into Cheerio to parse the DOM
      const $ = cheerio.load(html);

      // Remove noisy elements that confuse AI text extraction
      $("script, style, noscript, iframe, img, svg, header, footer, nav, .menu, .sidebar").remove();

      // Extract the raw text from the remaining body
      let text = $("body").text() || $.text();

      // Strip out excessive newlines and tabs to compress payload size
      text = text.replace(/\\s+/g, ' ').trim();

      if (text.length < 50) {
        throw new Error("Scraped page appears to be almost empty. It may be blocked by a Captcha, or the jobs are loaded via Javascript instead of static HTML.");
      }

      // Truncate to save Gemini tokens if the site is massive (e.g., huge TOCs)
      const MAX_CHARS = 15000;
      if (text.length > MAX_CHARS) {
        text = text.slice(0, MAX_CHARS);
      }

      res.json({ text });
    } catch (error: any) {
      console.error("URL Scraping error:", error);
      res.status(500).json({
        message: "Failed to scrape URL. The site might block bots or require Javascript.",
        details: error.message
      });
    }
  });

  app.post("/api/admin/jobs", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Check if it's a multiple positions job
      if (req.body.useMultiplePositions && req.body.jobPositions) {
        // Handle multiple positions job
        const job = await storage.createJobWithPositions(req.body);

        // Log the manual job creation
        await adminStorage.createProcessingLog({
          adminId,
          url: req.body.sourceUrl || "Manual Entry",
          status: "completed",
          extractedData: req.body,
          validatedData: req.body,
          errorMessage: null,
          processingTimeMs: 0,
          jobId: job.id
        });

        res.status(201).json(job);
      } else {
        // Handle single position job
        const jobData = insertJobSchema.parse(req.body);
        const job = await storage.createJob(jobData);

        // Log the manual job creation
        await adminStorage.createProcessingLog({
          adminId,
          url: jobData.sourceUrl || "Manual Entry",
          status: "completed",
          extractedData: jobData,
          validatedData: jobData,
          errorMessage: null,
          processingTimeMs: 0,
          jobId: job.id
        });

        res.status(201).json(job);
      }
    } catch (error: any) {
      console.error("Failed to create manual job. Payload:", JSON.stringify(req.body, null, 2));
      console.error("Zod Error Details:", error.errors ? JSON.stringify(error.errors, null, 2) : error);
      res.status(400).json({
        message: "Invalid job data",
        error: error.errors ? error.errors : (error.message || String(error))
      });
    }
  });

  // ========== USER AUTHENTICATION ROUTES ==========

  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = userRegisterSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Create session
      const token = createUserSession(user.id);

      res.status(201).json({
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data", error: error instanceof Error ? error.message : error });
    }
  });

  // User login
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = userLoginSchema.parse(req.body);

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await verifyUserPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      const token = createUserSession(user.id);

      res.json({
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data", error });
    }
  });

  // User logout
  app.post("/api/users/logout", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      revokeUserSession(token);
    }
    res.json({ message: "Logged out successfully" });
  });

  // Get current user
  app.get("/api/users/me", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const userId = requireUserAuth(token);

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user || !user.isActive) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data", error });
    }
  });

  // Process URL for job extraction
  app.post("/api/admin/process-url", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { url, templateId, autoPublish } = processUrlSchema.parse(req.body);

      // Create processing log
      const processingLog = await adminStorage.createProcessingLog({
        adminId,
        url,
        status: "processing",
        extractedData: null,
        validatedData: null,
        errorMessage: null,
        processingTimeMs: null,
        jobId: null
      });

      // Process URL
      const result = await urlProcessor.processUrl(url, templateId);

      if (result.success && result.data) {
        // Determine if extraction quality is good enough for auto-publish
        const extractionQuality = calculateExtractionQuality(result.data);
        const shouldAutoPublish = autoPublish && extractionQuality >= 0.8;

        let jobId = null;
        let status = shouldAutoPublish ? "completed" : "review_required";

        if (shouldAutoPublish) {
          try {
            const job = await storage.createJob(result.data as any);
            jobId = job.id;
          } catch (error) {
            status = "review_required";
            console.error("Auto-publish failed:", error);
          }
        }

        // Update processing log
        await adminStorage.updateProcessingLog(processingLog.id, {
          status,
          extractedData: result.data,
          processingTimeMs: result.processingTimeMs,
          jobId
        });

        res.json({
          success: true,
          status,
          extractedJob: result.data,
          processingTimeMs: result.processingTimeMs,
          logId: processingLog.id
        });
      } else {
        // Update processing log with error
        await adminStorage.updateProcessingLog(processingLog.id, {
          status: "failed",
          errorMessage: result.error,
          processingTimeMs: result.processingTimeMs
        });

        res.status(400).json({
          success: false,
          message: result.error,
          logId: processingLog.id
        });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error });
    }
  });

  // Publish reviewed job
  app.post("/api/admin/publish-job", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      console.log("Publish job request body:", JSON.stringify(req.body, null, 2));
      const { logId, jobData } = req.body;

      if (!jobData) {
        console.error("Missing jobData in request body:", req.body);
        return res.status(400).json({ message: "Missing job data" });
      }

      // Ensure jobData has required fields and proper format
      const processedJobData = {
        title: String(jobData.title || "Untitled Position"),
        department: String(jobData.department || "Government Department"),
        location: String(jobData.location || "India"),
        qualification: String(jobData.qualification || "As per official notification"),
        deadline: String(jobData.deadline || new Date().toISOString().split('T')[0]),
        applyLink: String(jobData.applyLink || jobData.applicationUrl || "https://example.gov.in/apply"),
        postedOn: String(jobData.postedOn || new Date().toISOString().split('T')[0]),
        sourceUrl: String(jobData.sourceUrl || jobData.url || "https://example.gov.in/notification"),
        positions: parseInt(jobData.positions) || 1,
        salary: jobData.salary || null,
        description: jobData.description || null,
        ageLimit: jobData.ageLimit || null,
        applicationFee: jobData.applicationFee || null,
        selectionProcess: jobData.selectionProcess || null
      };

      console.log("Processed job data:", JSON.stringify(processedJobData, null, 2));

      // Validate required fields before insertion
      const requiredFields: (keyof typeof processedJobData)[] = ['title', 'department', 'location', 'qualification', 'deadline', 'applyLink', 'postedOn', 'sourceUrl'];
      for (const field of requiredFields) {
        const fieldValue = processedJobData[field];
        if (!fieldValue || fieldValue === 'null') {
          console.error(`Required field ${field} is missing or null: `, fieldValue);
          return res.status(400).json({ message: `Required field ${field} is missing` });
        }
      }

      const job = await storage.createJob(processedJobData);

      // Update processing log if logId provided
      if (logId) {
        try {
          await adminStorage.updateProcessingLog(logId, {
            status: "completed",
            jobId: job.id
          });
        } catch (logError) {
          console.error("Failed to update processing log:", logError);
          // Don't fail the request if log update fails
        }
      }

      res.json({
        success: true,
        job
      });
    } catch (error) {
      console.error("Publish job error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Failed to publish job", error: errorMessage });
    }
  });

  // Get processing history
  app.get("/api/admin/processing-history", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const logs = await adminStorage.getProcessingLogsByAdmin(adminId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history", error });
    }
  });

  // Template management routes
  app.get("/api/admin/templates", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const templates = await adminStorage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates", error });
    }
  });

  // ========== ADMIN MANAGEMENT ROUTES ==========

  // Change admin password
  app.post("/api/admin/change-password", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { currentPassword, newPassword } = adminPasswordChangeSchema.parse(req.body);

      // Get current admin user
      const admin = await adminStorage.getAdminById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Verify current password
      const isValidPassword = currentPassword === admin.password || await verifyPassword(currentPassword, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password and update
      const hashedNewPassword = await hashAdminPassword(newPassword);
      const success = await adminStorage.updateAdminPassword(adminId, hashedNewPassword);

      if (success) {
        res.json({ message: "Password changed successfully" });
      } else {
        res.status(500).json({ message: "Failed to change password" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error });
    }
  });

  // Create new admin user
  app.post("/api/admin/users", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const userData = createAdminUserSchema.parse(req.body);

      // Check if username already exists
      const existingAdmin = await adminStorage.getAdminByUsername(userData.username);
      if (existingAdmin) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashAdminPassword(userData.password);

      // Create admin user
      const newAdmin = await adminStorage.createAdminUser({
        ...userData,
        password: hashedPassword
      });

      res.status(201).json({
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        isActive: newAdmin.isActive
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // Update job post (admin only)
  app.put("/api/admin/jobs/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const jobData = updateJobSchema.parse(req.body);
      const job = await storage.updateJob(req.params.id, jobData);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      res.status(400).json({ message: "Invalid job data", error });
    }
  });

  // Delete job post (admin only)
  app.delete("/api/admin/jobs/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const deleted = await storage.deleteJob(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete job", error });
    }
  });

  // XML Sitemap routes for SEO
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://govtjobsnow.com";
      const currentDate = new Date().toISOString();

      const sitemap = `<? xml version = "1.0" encoding = "UTF-8" ?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" >
          <sitemap>
          <loc>${baseUrl} /sitemap-main.xml</loc >
            <lastmod>${currentDate} </lastmod>
              </sitemap>
              < sitemap >
              <loc>${baseUrl} /sitemap-jobs.xml</loc >
                <lastmod>${currentDate} </lastmod>
                  </sitemap>
                  < sitemap >
                  <loc>${baseUrl} /sitemap-categories.xml</loc >
                    <lastmod>${currentDate} </lastmod>
                      </sitemap>
                      </sitemapindex>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sitemap", error });
    }
  });

  // Main pages sitemap
  app.get("/sitemap-main.xml", async (req, res) => {
    try {
      const baseUrl = "https://govtjobsnow.com";
      const currentDate = new Date().toISOString();

      const mainPages = [
        { url: "", priority: "1.0", changefreq: "daily" },
        { url: "/contact", priority: "0.7", changefreq: "monthly" },
        { url: "/faq", priority: "0.7", changefreq: "monthly" },
        { url: "/privacy-policy", priority: "0.5", changefreq: "monthly" },
        { url: "/terms-of-service", priority: "0.5", changefreq: "monthly" },
        { url: "/disclaimer", priority: "0.5", changefreq: "monthly" }
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate main sitemap", error });
    }
  });

  // Jobs sitemap (dynamic from database)
  app.get("/sitemap-jobs.xml", async (req, res) => {
    try {
      const baseUrl = "https://govtjobsnow.com";
      const result = await storage.searchJobs({ page: 1, limit: 1000 });

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${result.jobs.map(job => `  <url>
    <loc>${baseUrl}/job/${job.id}</loc>
    <lastmod>${job.postedOn}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate jobs sitemap", error });
    }
  });

  // Categories sitemap
  app.get("/sitemap-categories.xml", async (req, res) => {
    try {
      const baseUrl = "https://govtjobsnow.com";
      const currentDate = new Date().toISOString();

      const categories = [
        { url: "/jobs/ssc", name: "SSC Jobs" },
        { url: "/jobs/railway", name: "Railway Jobs" },
        { url: "/jobs/banking", name: "Banking Jobs" },
        { url: "/jobs/upsc", name: "UPSC Jobs" },
        { url: "/jobs/defence", name: "Defence Jobs" },
        { url: "/jobs/psu", name: "PSU Jobs" },
        { url: "/state/maharashtra", name: "Maharashtra Govt Jobs" },
        { url: "/state/delhi", name: "Delhi Govt Jobs" },
        { url: "/state/uttar-pradesh", name: "UP Govt Jobs" },
        { url: "/state/karnataka", name: "Karnataka Govt Jobs" },
        { url: "/state/tamil-nadu", name: "Tamil Nadu Govt Jobs" }
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.map(category => `  <url>
    <loc>${baseUrl}${category.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate categories sitemap", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate extraction quality
function calculateExtractionQuality(data: any): number {
  const requiredFields = ['title', 'department', 'location', 'qualification', 'deadline'];
  let score = 0;

  for (const field of requiredFields) {
    if (data[field] && typeof data[field] === 'string' && data[field].length > 5) {
      score += 0.2; // Each required field is worth 20%
    }
  }

  // Bonus points for additional useful fields
  if (data.salary && data.salary.length > 3) score += 0.05;
  if (data.description && data.description.length > 50) score += 0.05;
  if (data.positions && !isNaN(data.positions)) score += 0.05;

  return Math.min(score, 1.0);
}
