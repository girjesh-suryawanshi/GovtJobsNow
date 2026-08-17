import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, searchJobsSchema, adminLoginSchema, processUrlSchema, userLoginSchema, userRegisterSchema, adminPasswordChangeSchema, createAdminUserSchema, updateJobSchema, insertExamSchema, insertSiteSettingsSchema } from "@shared/schema";
import { z } from "zod";
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
import { generateFeaturedImage } from "./generate-image";
import { aiRouter } from "./ai-router";

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

  // Robots.txt — allows general + AI search crawlers, blocks admin routes
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.BASE_URL || "https://govtjobnow.com";
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Sitemap: ${baseUrl}/sitemap.xml
llms-txt: ${baseUrl}/llms.txt

# Google AdSense
User-agent: Mediapartners-Google
Allow: /

# AI Search Agents — allowed to crawl public content for GEO/AEO
User-agent: GPTBot
Allow: /
Disallow: /admin/

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /
Disallow: /admin/

User-agent: Google-Extended
Allow: /
Disallow: /admin/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/

User-agent: Bingbot
Allow: /
Disallow: /admin/

User-agent: cohere-ai
Allow: /
Disallow: /admin/

User-agent: Applebot-Extended
Allow: /
Disallow: /admin/`);
  });

  // LLMS.txt — Generative Engine Optimization (GEO) Feed for LLMs (ChatGPT, Gemini, Perplexity, Claude)
  app.get(["/llms.txt", "/llms-full.txt"], async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://govtjobnow.com";
      const recentJobs = await storage.getAllJobs(20);
      
      let markdown = `# GovtJobNow.com — Official Government Job Verification Engine\n\n`;
      markdown += `> GovtJobNow (https://govtjobnow.com) is an independent recruitment information aggregator dedicated to providing structured, verified, and timely notifications for Indian Central and State Government employment opportunities.\n\n`;
      
      markdown += `## Primary Qualification & Category Hubs\n`;
      markdown += `- [10th Pass Govt Jobs](${baseUrl}/10th-pass-govt-jobs): Class 10th / Matriculation recruitment notifications.\n`;
      markdown += `- [12th Pass Govt Jobs](${baseUrl}/12th-pass-govt-jobs): Higher Secondary recruitment announcements.\n`;
      markdown += `- [Graduate Govt Jobs](${baseUrl}/graduate-govt-jobs): Degree level vacancies across central & state departments.\n`;
      markdown += `- [SSC Recruitment](${baseUrl}/jobs/ssc): Staff Selection Commission CGL, CHSL, MTS, and GD posts.\n`;
      markdown += `- [Railway Jobs](${baseUrl}/jobs/railway): Railway Recruitment Boards (RRB) NTPC, Group D, and Technical roles.\n`;
      markdown += `- [Exam Calendar](${baseUrl}/exams): Upcoming government exam dates and admit card notifications.\n`;
      markdown += `- [Official Blog](${baseUrl}/blog): Syllabus breakdowns, preparation guides, and career analysis.\n\n`;

      markdown += `## Trust, E-E-A-T & Verification Policies\n`;
      markdown += `- [Editorial Policy](${baseUrl}/editorial-policy): Primary gazette sourcing (.gov.in / .nic.in) and human editorial verification rules.\n`;
      markdown += `- [Verification Protocol](${baseUrl}/verification-policy): 4-step recruitment validation protocol and fake job scam prevention.\n`;
      markdown += `- [Author Profile & Credentials](${baseUrl}/author/editorial-team): Senior Editorial Desk (15+ Years Domain Experience).\n`;
      markdown += `- [Report Correction Form](${baseUrl}/corrections): Community feedback and corrigendum reporting.\n\n`;

      markdown += `## Recent Verified Recruitment Notifications\n`;
      recentJobs.forEach(job => {
        const slug = job.slug || job.id;
        markdown += `- [${job.title}](${baseUrl}/job/${slug}): ${job.department} | Vacancies: ${job.positions || "Check Notice"} | Last Date: ${job.deadline || "TBA"}\n`;
      });

      res.type("text/plain");
      res.send(markdown);
    } catch (e) {
      res.status(500).send("Error generating llms.txt");
    }
  });


  // Dynamic ads.txt for Google AdSense compliance
  app.get("/ads.txt", async (req, res) => {
    res.type("text/plain");
    try {
      const settings = await storage.getSiteSettings();
      let pubId = "";
      if (settings?.adsHeaderCode) {
        const match = settings.adsHeaderCode.match(/pub-\d+/);
        if (match) pubId = match[0];
      }
      if (!pubId && process.env.ADSENSE_PUB_ID) {
        const envVal = process.env.ADSENSE_PUB_ID;
        pubId = envVal.startsWith("pub-") ? envVal : `pub-${envVal}`;
      }
      
      if (pubId) {
        return res.send(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n# GovtJobNow.com Official Google AdSense Record`);
      }
      res.send(`# GovtJobNow.com Authorized Digital Sellers (ads.txt)\n# Google AdSense Publisher ID is served dynamically once configured in Site Settings.\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`);
    } catch (error) {
      res.send(`# GovtJobNow.com Authorized Digital Sellers (ads.txt)\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`);
    }
  });


  // Setup Multer for PDF/Image Notification Uploads - Allow configuration via environment variable
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
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
    limits: { fileSize: 100 * 1024 * 1024 } // Increased to 100MB to support large PDFs
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
      const allJobs = await storage.getAllJobs(5000); // Limit to prevent OOM on large datasets
      const baseUrl = process.env.BASE_URL || "https://govtjobnow.com";

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Static routes
      const staticRoutes = [
        { path: "", priority: "1.0", changefreq: "daily" },
        { path: "/blog", priority: "0.9", changefreq: "daily" },
        { path: "/exams", priority: "0.8", changefreq: "daily" },
        { path: "/about-us", priority: "0.6", changefreq: "monthly" },
        { path: "/contact", priority: "0.5", changefreq: "monthly" },
        { path: "/faq", priority: "0.7", changefreq: "weekly" },
        { path: "/privacy-policy", priority: "0.4", changefreq: "yearly" },
        { path: "/terms-of-service", priority: "0.4", changefreq: "yearly" },
        { path: "/disclaimer", priority: "0.4", changefreq: "yearly" },
        { path: "/editorial-policy", priority: "0.6", changefreq: "monthly" },
        { path: "/verification-policy", priority: "0.6", changefreq: "monthly" },
        { path: "/corrections", priority: "0.5", changefreq: "monthly" },
        { path: "/author/editorial-team", priority: "0.6", changefreq: "monthly" },
        { path: "/jobs/ssc", priority: "0.8", changefreq: "daily" },
        { path: "/jobs/railway", priority: "0.8", changefreq: "daily" },
      ];


      const seoSlugs = [
        "10th-pass-govt-jobs", "12th-pass-govt-jobs", "iti-govt-jobs", "diploma-govt-jobs", "graduate-govt-jobs", "btech-govt-jobs",
        "government-jobs-in-maharashtra", "government-jobs-in-uttar-pradesh", "government-jobs-in-madhya-pradesh", "government-jobs-in-rajasthan", "government-jobs-in-bihar", "government-jobs-in-delhi",
        "isro-jobs", "drdo-jobs", "sbi-jobs", "rbi-jobs", "lic-jobs", "indian-post-jobs", "railway-jobs", "ssc-jobs", "upsc-jobs", "defence-jobs", "bank-jobs", "army-jobs", "navy-jobs", "air-force-jobs",
        "ssc-cgl", "ssc-chsl", "ibps-po", "rrb-ntpc", "upsc-cse"
      ];
      
      seoSlugs.forEach(slug => {
        staticRoutes.push({ path: `/${slug}`, priority: "0.8", changefreq: "daily" });
      });
      for (const route of staticRoutes) {
        xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
      }

      // Job routes (prefer slug, fallback to id)
      for (const job of allJobs) {
        const jobPath = job.slug ? `/job/${job.slug}` : `/job/${job.id}`;
        const lastMod = job.createdAt ? new Date(job.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        xml += `  <url>\n    <loc>${baseUrl}${jobPath}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }

      // Blog post routes
      try {
        const { blogStorage } = await import("./blog-storage");
        const blogEntries = await blogStorage.getAllPublishedForSitemap();
        for (const post of blogEntries) {
          const lastMod = (post.updatedAt || post.publishedAt)
            ? new Date((post.updatedAt || post.publishedAt)!).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
          xml += `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
        }
      } catch (blogErr) {
        console.warn("[Sitemap] Could not load blog posts:", blogErr);
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600"); // cache 1 hour
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

      // Remove empty strings or "null"/"undefined" strings to prevent Zod validation errors on enums
      Object.keys(processedQuery).forEach(key => {
        if (processedQuery[key] === "" || processedQuery[key] === "null" || processedQuery[key] === "undefined") {
          delete processedQuery[key];
        }
      });

      const params = searchJobsSchema.parse(processedQuery);
      const result = await storage.searchJobs(params);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters", error });
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

  // Get live job counts by department — used for category grid (must be before /:id)
  app.get("/api/jobs/dept-counts", async (req, res) => {
    try {
      const counts = await storage.getDepartmentCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch department counts", error });
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

  // Get single job by slug
  app.get("/api/jobs/slug/:slug", async (req, res) => {
    try {
      const job = await storage.getJobBySlug(req.params.slug);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Increment view count asynchronously
      storage.incrementJobViewCount(job.id).catch(err => {
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
      // This is a legacy endpoint, we'll assign a generic editor if used without auth
      const jobData = insertJobSchema.parse({ ...req.body, authorName: "GovtJobsNow Editor" });
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

  // Get single exam by slug
  app.get("/api/exams/slug/:slug", async (req, res) => {
    try {
      const exam = await storage.getExamBySlug(req.params.slug);
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
      const { fromError } = await import("zod-validation-error");
      const result = insertExamSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({ 
          message: "Invalid exam data", 
          details: validationError.toString(),
          error: result.error 
        });
      }

      const examData = result.data;
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ message: "Invalid exam data", details: (error as any).message || String(error), error: error });
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
      res.status(400).json({ message: "Invalid exam data", details: (error as any).message || String(error), error: error });
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

      // Primary: bcrypt verification (for properly hashed passwords)
      // Fallback: direct match only for legacy accounts where password is stored as plain text
      const isBcryptHash = admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$');
      const isValidPassword = isBcryptHash
        ? await verifyPassword(password, admin.password)
        : password === admin.password;
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

  // Site Settings Management (AdSense Control)
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings", error });
    }
  });

  app.patch("/api/admin/site-settings", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertSiteSettingsSchema.partial().parse(req.body);
      const updated = await storage.updateSiteSettings(data);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data", error });
    }
  });

function smartOrganizeJobText(rawText: string) {
  let title = rawText.split('\n')[0] || "Government Job Recruitment Notification 2026";
  title = title
    .replace(/^(FreeJobAlert\.Com|SarkariResult\.Com|EmploymentNews|Job Portal|Home|Welcome to)\s*[-:]?\s*/i, "")
    .replace(/(Results|Admit Cards|Answer Key|Syllabus)\s*Home/gi, "")
    .replace(/St\s*2026/g, "2026")
    .replace(/\s+/g, ' ')
    .trim();

  if (!title || title.length < 5) {
    title = "Government Job Recruitment Notification 2026";
  }

  let department = "Other Government Department";
  let recruitingOrg = "Government Department";
  let jobCategory = "Central Government";

  if (/Staff Selection Commission|SSC/i.test(rawText)) {
    department = "Staff Selection Commission";
    recruitingOrg = "Staff Selection Commission";
    jobCategory = "Central Government";
  } else if (/Union Public Service Commission|UPSC/i.test(rawText)) {
    department = "Union Public Service Commission";
    recruitingOrg = "Union Public Service Commission";
    jobCategory = "Central Government";
  } else if (/Railway|RRB|RRC/i.test(rawText)) {
    department = "Railway Recruitment Board";
    recruitingOrg = "Railway Recruitment Board";
    jobCategory = "Railway";
  } else if (/Bank|SBI|IBPS|RBI|NABARD/i.test(rawText)) {
    department = "Banking Sector";
    recruitingOrg = "Banking Selection Board";
    jobCategory = "Banking";
  } else if (/Police|Constable|SI|Daroga/i.test(rawText)) {
    department = "Police & Security Forces";
    recruitingOrg = "State Police Recruitment Board";
    jobCategory = "Police";
  } else if (/Army|Navy|Air Force|Defence|NDA|CDS/i.test(rawText)) {
    department = "Defense Services";
    recruitingOrg = "Ministry of Defence";
    jobCategory = "Defence";
  } else if (/AIIMS|Health|Medical|Hospital|Doctor|Nurse/i.test(rawText)) {
    department = "Healthcare & Medical";
    recruitingOrg = "Health Department";
    jobCategory = "Healthcare";
  } else if (/Teacher|School|College|University|Prof|Lecturer|TET|CTET/i.test(rawText)) {
    department = "Education & Teaching";
    recruitingOrg = "Education Department";
    jobCategory = "Education";
  } else if (/PSU|ONGC|NTPC|BHEL|SAIL|GAIL|IOCL|BPCL/i.test(rawText)) {
    department = "Public Sector Undertaking";
    recruitingOrg = "Public Sector Enterprise";
    jobCategory = "PSU";
  }

  let qualification = "Graduate (Any Stream)";
  if (/10th|Matriculation|SSLC|High School/i.test(rawText)) {
    qualification = "10th Pass";
  } else if (/12th|Higher Secondary|Intermediate|10\+2/i.test(rawText)) {
    qualification = "12th Pass";
  } else if (/ITI|Diploma/i.test(rawText)) {
    qualification = "ITI/Diploma";
  } else if (/B\.Tech|B\.E\.|Engineering/i.test(rawText)) {
    qualification = "Engineering Degree";
  } else if (/MBBS|MD|BAMS|Nursing/i.test(rawText)) {
    qualification = "Medical Degree";
  } else if (/Post Graduate|M\.A|M\.Sc|M\.Com|M\.Tech/i.test(rawText)) {
    qualification = "Post Graduate";
  }

  let positions = "100+";
  const posMatch = rawText.match(/(\d+[\d,]*)\s*(posts|vacancies|positions|openings)/i);
  if (posMatch) {
    positions = posMatch[1].replace(/,/g, '');
  }

  let deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dateMatch = rawText.match(/(\d{4}[-/]\d{2}[-/]\d{2})|(\d{2}[-/]\d{2}[-/]\d{4})/);
  if (dateMatch) {
    const rawDate = dateMatch[0];
    if (rawDate.includes("-") || rawDate.includes("/")) {
      const parts = rawDate.split(/[-/]/);
      if (parts[0].length === 4) {
        deadline = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else if (parts[2].length === 4) {
        deadline = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
  }

  let applyLink = "https://example.com/apply";
  const urlMatch = rawText.match(/(https?:\/\/[^\s"'<>]+)/i);
  if (urlMatch) {
    applyLink = urlMatch[1];
  }

  let salary = "As per Govt Rules (Level 4 to Level 7)";
  const salMatch = rawText.match(/(Rs\.?|₹)\s*[\d,]+\s*-\s*[\d,]+/i);
  if (salMatch) salary = salMatch[0];

  let ageLimit = "18 - 30 Years";
  const ageMatch = rawText.match(/(\d{2})\s*(to|-)\s*(\d{2})\s*years?/i);
  if (ageMatch) ageLimit = `${ageMatch[1]} - ${ageMatch[3]} Years`;

  let applicationFee = "Rs. 100/- (Exempted for SC/ST/Women)";
  if (/fee/i.test(rawText)) {
    const feeMatch = rawText.match(/(Rs\.?|₹)\s*\d+/i);
    if (feeMatch) applicationFee = `${feeMatch[0]}/- (As per Notice)`;
  }

  const description = `> **Quick Summary:** Official recruitment notification released for various posts. Eligible candidates can review details and apply online before ${deadline}.

### 📝 Quick Summary
Applications are invited from eligible Indian citizens for recruitment to various positions. Candidates must review the official gazette guidelines before submitting the online form.

### 💡 Key Takeaways
- **Recruiting Authority:** ${recruitingOrg}
- **Post Name:** Various Vacancies
- **Total Positions:** ${positions}
- **Qualification:** ${qualification}
- **Application Deadline:** ${deadline}
- **Selection Process:** Written Examination followed by Document Verification
- **Application Fee:** ${applicationFee}

<!-- SPLIT -->

> 📌 **Related Opportunity:** Looking for more vacancies? Explore our updated lists of [10th Pass Govt Jobs](https://govtjobnow.com/10th-pass-govt-jobs) and [Graduate Govt Jobs](https://govtjobnow.com/graduate-govt-jobs).

### 📄 Important Documents Required to Apply for ${recruitingOrg} Recruitment
- Identity Proof (Aadhar Card / Voter ID / Passport)
- Educational Qualification Certificates & Marksheets
- Category / Caste Certificate (if applicable)
- Passport size recent photograph and signature scan

### 🏆 Selection Process for ${recruitingOrg} Recruitment
- Stage 1: Computer Based Examination / Written Test
- Stage 2: Skill Test / Physical Efficiency Test (where applicable)
- Stage 3: Document Verification & Medical Examination

### ⚠️ Common Mistakes / What to Check Before Applying for ${recruitingOrg} Recruitment
- Ensure all personal details match official matriculation certificates.
- Upload clear, recent photograph with light background.
- Verify eligibility criteria and fee payment receipt before final submission.

> 🛡️ **Verification Note:** All recruitment notifications published on GovtJobNow are verified against official government gazettes per our [Editorial Policy](https://govtjobnow.com/editorial-policy).

### 👤 Who Can Apply for This Job & How to Apply for ${recruitingOrg} Recruitment
**Who Can Apply:**
- Indian citizens meeting the specified age limit and educational qualifications (${qualification}).

**How to Apply (Overview):**
- Visit the official portal, register your profile, fill application details, and pay fee before ${deadline}.

### 📝 How to Apply for ${recruitingOrg} Recruitment — Step-by-Step Guide
1. Go to the official recruitment portal.
2. Click on New Registration and complete profile setup.
3. Fill educational and personal details accurately.
4. Upload required documents and pay application fee.
5. Submit application and print receipt for future reference. Apply before the last date to avoid last-minute technical issues.`;

  return {
    title,
    department,
    location: "All India",
    qualification,
    deadline,
    salary,
    description,
    applyLink,
    sourceUrl: applyLink !== "https://example.com/apply" ? applyLink : "Manual Entry",
    positions,
    ageLimit,
    applicationFee,
    selectionProcess: "Written Exam & Document Verification",
    experienceRequired: "Freshers Eligible",
    jobCategory,
    employmentType: "Permanent",
    recruitingOrganization: recruitingOrg,
    applicationStartDate: new Date().toISOString().split('T')[0],
    vacancyBreakdown: "Detailed breakdown in official notification PDF",
    prepGuide: "Focus on General Awareness, Quantitative Aptitude, Reasoning, and English Language basics.",
    syllabus: "General Intelligence, General Knowledge, Numerical Ability, English Comprehension"
  };
}

  // Admin manual job creation
  // Gemini AI Job Extraction
  app.post("/api/admin/extract-job", async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { rawText, provider } = req.body;
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

      CRITICAL JSON FORMATTING:
      You are generating a JSON object. All string values MUST be on a single line. YOU MUST NOT USE ACTUAL NEWLINE CHARACTERS IN THE OUTPUT.
      If you need to represent a newline or line break inside the Markdown description, you MUST type the literal characters \\n (a backslash followed by the letter n).
      Do NOT output multi-line strings. Failure to escape newlines will crash the system.
      
      - "title": Create a catchy, clear, and professional job title.
      - "description": You are an expert job posting writer and SEO/AEO/GEO content strategist. Transform the raw job posting into a fully optimized, humanized, and structured job listing that ranks on traditional search engines AND gets cited by AI search engines. You MUST format the description using Markdown. Use the actual organization or department name where [Organization Name] is specified. Include the following structure:

        STEP 1 — REWRITE THE MAIN JOB DESCRIPTION
        - Start with the exact heading "### 📝 Quick Summary".
        - Under this heading, write ONLY a compelling intro paragraph that summarizes the opportunity in 3–4 sentences.
        - Next, add the exact heading "### 💡 Key Takeaways".
        - Extract Key Takeaways directly from the official notification content. Do NOT generate generic career advice.
        - Generate concise bullet points from actual notification information.
        - Include important details such as: Post Name, Total Vacancies, Eligibility Highlights, Age Limit, Application Dates, Application Fee, Selection Process, Important Instructions, Reservation Highlights, Special Conditions.
        - This "Key Takeaways" section should contain 6-10 primary bullet points covering all the crucial details.
        
        CRITICAL: Immediately after the "Key Takeaways" section, you MUST insert the exact text "<!-- SPLIT -->" on its own line. Do not forget this separator.

        STEP 2 — ADD THE FOLLOWING 5 SECTIONS EXACTLY IN THIS ORDER (formatted as Markdown H3 '###'):

        ### 📄 Important Documents Required to Apply for [Organization Name] Recruitment
        List all documents in bullet points. Organize them in this order: 1. Identity & personal documents, 2. Educational certificates, 3. Category/caste certificate (if applicable), 4. Experience certificates (if applicable), 5. Photographs & signature, 6. Fee payment proof (if applicable). Write each document name clearly. Add a short note in brackets if needed (e.g., "Aadhar Card [for identity verification]").

        ### 🏆 Selection Process for [Organization Name] Recruitment
        Write the full selection process in bullet points. Include: each stage of selection (written test, physical test, interview, document verification, medical, etc.), what happens at each stage in simple language, qualifying criteria if mentioned, and final merit list / appointment process. Write it as if explaining to a first-time government job applicant.

        ### ⚠️ Common Mistakes / What to Check Before Applying for [Organization Name] Recruitment
        Write this section as a helpful, friendly guide. Use bullet points. Each point should be: specific and actionable (not generic), written in simple, human language, and focused on real mistakes candidates commonly make (wrong form, missing documents, age miscalculation, wrong category, signature missing, photo issues, fee payment errors, etc.). Include 8–12 bullet points.

        ### 👤 Who Can Apply for This Job & How to Apply for [Organization Name] Recruitment
        Write this section in two parts:
        **Who Can Apply:**
        - List eligibility criteria in bullet points (age, education, nationality, category-wise relaxation if any). Each bullet should be a complete, clear sentence. If age relaxation exists for SC/ST/OBC/PwD, mention it clearly.
        **How to Apply (Overview):**
        - Give a brief step-by-step overview in bullet points (detailed steps go in Section 5). Keep it simple: online/offline, portal name, deadline.

        ### 📝 How to Apply for [Organization Name] Recruitment — Step-by-Step Guide
        Write a detailed step-by-step application guide in numbered bullet points. Include: where to go (official website URL if available), how to register, how to fill the form, how to upload documents, how to pay the fee, and how to submit and save the confirmation. End this section with: "Apply before the last date to avoid last-minute technical issues."

        STEP 3 — SEO + AEO + GEO OPTIMIZATION RULES (apply throughout the description):
        - Include the organization name + post name in every section heading.
        - Use FAQ-style phrasing naturally within content (e.g., "Candidates often ask whether...").
        - Write dates in full format (e.g., "15 June 2025" not "15/06/25") so AI engines read them correctly.
        - Use location + job title together in at least 3 places (e.g., "Madhya Pradesh government job 2025", "[Organization] vacancy in [State/City]").
        - Avoid keyword stuffing — write for humans first, search engines second.
        - Every section must be able to stand alone as an answer snippet (AI engines pull sections independently).
        - Use simple, active voice sentences — no passive voice where possible.
        - Add a 2–3 line TL;DR summary at the very top of the description (before everything else) formatted exactly as:
          > **Quick Summary:** [Organization Name] has released [X] vacancies for [Post Name]. Eligible candidates can apply [online/offline] before [Last Date]. [One key eligibility line].
      
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

      const response = await generateText(prompt, provider || "groq");
      // Robust JSON cleaning to strip markdown and conversational text
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error("No JSON found in AI response. Raw response (first 500 chars):", response.slice(0, 500));
        throw new Error("No JSON object found in response");
      }
      let jsonStr = match[0];

      let parsedData;
      try {
        parsedData = JSON.parse(jsonStr);
      } catch (parseError) {
        // Fallback: manually escape unescaped newlines inside strings.
        // LLMs frequently fail to escape newlines when writing Markdown inside JSON strings.
        let inString = false;
        let cleaned = "";
        for (let i = 0; i < jsonStr.length; i++) {
          const char = jsonStr[i];
          if (char === '"' && jsonStr[i - 1] !== '\\') {
            inString = !inString;
          }
          if (inString && char === '\n') {
            cleaned += '\\n';
          } else if (inString && char === '\r') {
            // strip carriage returns
          } else if (inString && char === '\t') {
            cleaned += '\\t';
          } else {
            cleaned += char;
          }
        }
        try {
          parsedData = JSON.parse(cleaned);
        } catch (secondError) {
          throw new Error("Failed to parse JSON even after cleaning: " + secondError);
        }
      }

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
            if (typeof cleanedPos[k] === "number") cleanedPos[k] = cleanedPos[k].toString();
          }
          return cleanedPos;
        });
        parsedData.useMultiplePositions = parsedData.jobPositions.length > 1;
      }

    } catch (error: any) {
      console.warn("AI extraction unavailable or error occurred. Running Smart Local Organizer...", error?.message || error);
      const localOrganizedData = smartOrganizeJobText(rawText);
      res.json(localOrganizedData);
    }
  });


  // AI Exam Extraction (Supports Groq/Gemini)
  app.post("/api/admin/extract-exam", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    const { rawText, provider } = req.body;
    if (!rawText) return res.status(400).json({ message: "Raw text is required" });
  
    try {
      const { generateText } = await import("./gemini");
      const prompt = `Extract exam details from the following text and return ONLY a JSON object compatible with the following schema.
      For fields with specific options, you MUST choose the closest matching option from the allowed list. If no exact match or the data is missing, return an empty string "" (never return null).
      
      ALLOWED OPTIONS:
      - dates (registrationStartDate, registrationEndDate, examDate, admitCardDate, resultsDate): MUST strictly be in YYYY-MM-DD format if available, otherwise return "".
  
      CRITICAL SEO INSTRUCTION:
      The "title" field must NOT be an exact copy-paste from the source text. You must REWRITE it to be highly attractive, professional, and 100% unique human-written content to avoid Google SEO penalties.
      - "title": Create a catchy, clear, and professional exam title.
      
      SCHEMA:
      {
        "title": "Rewritten SEO Exam Title",
        "conductingOrganization": "Organization Name (e.g., SSC, UPSC, IBPS)",
        "registrationStartDate": "YYYY-MM-DD",
        "registrationEndDate": "YYYY-MM-DD",
        "examDate": "YYYY-MM-DD",
        "admitCardDate": "YYYY-MM-DD",
        "resultsDate": "YYYY-MM-DD",
        "vacancies": "Number of Vacancies (e.g., 1500 posts)",
        "officialWebsite": "https://example.com/apply"
      }
      
      DATE HANDLING: 
      - If a specific date is not explicitly found but a general timeframe is mentioned (e.g., 'May 2025' or 'Tentative'), provide the best estimation in YYYY-MM-DD format (e.g., '2025-05-01').
      - If no estimation is possible, return an empty string "".
  
      Text: ${rawText}`;
  
      const response = await generateText(prompt, provider || "groq");
      // Robust JSON cleaning to strip markdown and conversational text
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error("No JSON found in AI response. Raw response (first 500 chars):", response.slice(0, 500));
        throw new Error("No JSON object found in response");
      }
      let jsonStr = match[0];
  
      let parsedData;
      try {
        parsedData = JSON.parse(jsonStr);
      } catch (parseError) {
        let inString = false;
        let cleaned = "";
        for (let i = 0; i < jsonStr.length; i++) {
          const char = jsonStr[i];
          if (char === '"' && jsonStr[i - 1] !== '\\') {
            inString = !inString;
          }
          if (inString && char === '\n') {
            cleaned += '\\n';
          } else if (inString && char === '\r') {
            // strip carriage returns
          } else if (inString && char === '\t') {
            cleaned += '\\t';
          } else {
            cleaned += char;
          }
        }
        try {
          parsedData = JSON.parse(cleaned);
        } catch (secondError) {
          throw new Error("Failed to parse JSON even after cleaning: " + secondError);
        }
      }
      // Clean nulls to empty strings for UI components
      for (const key in parsedData) {
        if (parsedData[key] === null) parsedData[key] = "";
        if (typeof parsedData[key] === "number") parsedData[key] = parsedData[key].toString();
      }
  
      res.json(parsedData);
    } catch (error) {
      console.error("Exam extraction error:", error);
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

      const contentType = scrapeRes.headers.get("content-type") || "";
      const isPdf = contentType.includes("application/pdf") || url.toLowerCase().endsWith(".pdf");

      let text = "";

      if (isPdf) {
        // PDF extraction logic
        const buffer = Buffer.from(await scrapeRes.arrayBuffer());
        const pdfParseModule = await import("pdf-parse");
        // Handle both ES and CommonJS default exports
        const pdfParse = (pdfParseModule as any).default || pdfParseModule;
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } else {
        // Standard HTML extraction logic
        const html = await scrapeRes.text();

        // Load into Cheerio to parse the DOM
        const $ = cheerio.load(html);

        // Remove noisy elements that confuse AI text extraction
        $("script, style, noscript, iframe, img, svg").remove();

        // Extract the raw text from the remaining body
        text = $("body").text() || $.text();
      }

      // Strip out excessive newlines and tabs to compress payload size
      text = text.replace(/\s+/g, ' ').trim();

      if (text.length < 50) {
        throw new Error(isPdf ? "Extracted PDF content appears to be almost empty." : "Scraped page appears to be almost empty. It may be blocked by a Captcha, or the jobs are loaded via Javascript instead of static HTML.");
      }

      // Truncate to save Gemini tokens but keep enough context for large notifications
      const MAX_CHARS = 30000;
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
      const adminUser = await adminStorage.getAdminById(adminId);
      const authorName = adminUser?.username || "GovtJobsNow Editor";
      
      // Inject authorName into the body
      req.body.authorName = authorName;

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
      
      let message = "Invalid job data";
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        message = `Validation Failed: ${firstError.path.join('.')} - ${firstError.message}`;
      } else if (error.code === '23505') { // Postgres unique_violation
        message = "A job with this title already exists (duplicate slug)";
      } else if (error.message) {
        message = error.message;
      }

      res.status(400).json({
        message,
        details: error.errors || error,
        error: true
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

  // Generate Featured Image
  app.post("/api/admin/generate-featured-image", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);

    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { title, department, qualification, positions, deadline, theme, customBgUrl } = req.body;
      const imageUrl = await generateFeaturedImage(
        title || "Government Job", 
        department || "", 
        qualification || "",
        positions || "1",
        deadline || "",
        theme || "saffron-glass",
        customBgUrl || ""
      );
      res.json({ success: true, imageUrl });
    } catch (error) {
      console.error("Image generation failed:", error);
      res.status(500).json({ success: false, message: "Image generation failed" });
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
        positions: jobData.positions?.toString() || "1",
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
      const baseUrl = "https://govtjobnow.com";
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
      const baseUrl = "https://govtjobnow.com";
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
      const baseUrl = "https://govtjobnow.com";
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
      const baseUrl = "https://govtjobnow.com";
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

  // ============================================================
  // BLOG ROUTES
  // ============================================================
  const { blogStorage } = await import("./blog-storage");
  const { insertBlogPostSchema, searchBlogPostsSchema } = await import("@shared/schema");

  // Serve IndexNow verification key file dynamically
  app.get("/:key.txt", (req, res, next) => {
    const indexNowKey = process.env.INDEXNOW_KEY;
    if (!indexNowKey || req.params.key !== indexNowKey) return next();
    res.type("text/plain").send(indexNowKey);
  });

  // ---- Public Blog Routes ----

  // GET /api/blog — paginated published posts
  app.get("/api/blog", async (req, res) => {
    try {
      const q: any = { ...req.query };
      if (q.page) q.page = parseInt(q.page);
      if (q.limit) q.limit = parseInt(q.limit);
      Object.keys(q).forEach((k) => { if (q[k] === "" || q[k] === "null") delete q[k]; });
      // Public endpoint always serves published posts only
      q.status = "published";
      const params = searchBlogPostsSchema.parse(q);
      const result = await blogStorage.getAllBlogPosts(params);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters", error });
    }
  });

  // GET /api/blog/recent — recent published posts for sidebar
  app.get("/api/blog/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const posts = await blogStorage.getRecentBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent posts", error });
    }
  });

  // GET /api/blog/tags — all unique tags from published posts
  app.get("/api/blog/tags", async (req, res) => {
    try {
      const { posts } = await blogStorage.getAllBlogPosts({ status: "published", limit: 200 });
      const tagSet = new Set<string>();
      posts.forEach((p) => {
        if (Array.isArray(p.tags)) p.tags.forEach((t: string) => tagSet.add(t));
      });
      res.json(Array.from(tagSet).sort());
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags", error });
    }
  });

  // GET /api/blog/:slug — single published post
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await blogStorage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ message: "Blog post not found" });
      }
      blogStorage.incrementBlogViewCount(post.id).catch(console.error);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post", error });
    }
  });

  // ---- Admin Blog Routes ----

  // GET /api/admin/blog — all posts (drafts + published)
  app.get("/api/admin/blog", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) return res.status(401).json({ message: "Unauthorized" });
    try {
      const q: any = { ...req.query };
      if (q.page) q.page = parseInt(q.page);
      if (q.limit) q.limit = parseInt(q.limit);
      Object.keys(q).forEach((k) => { if (q[k] === "" || q[k] === "null") delete q[k]; });
      const params = searchBlogPostsSchema.parse(q);
      const result = await blogStorage.getAllBlogPosts(params);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters", error });
    }
  });

  // POST /api/admin/blog — create blog post
  app.post("/api/admin/blog", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) return res.status(401).json({ message: "Unauthorized" });
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await blogStorage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        return res.status(400).json({ message: `Validation Error: ${issues}` });
      }
      console.error("Blog post creation error:", error);
      res.status(400).json({ message: "Invalid blog post data", error });
    }
  });

  // PUT /api/admin/blog/:id — update blog post
  app.put("/api/admin/blog/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) return res.status(401).json({ message: "Unauthorized" });
    try {
      const data = insertBlogPostSchema.partial().parse(req.body);
      const post = await blogStorage.updateBlogPost(req.params.id, data);
      if (!post) return res.status(404).json({ message: "Blog post not found" });
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        return res.status(400).json({ message: `Validation Error: ${issues}` });
      }
      console.error("Blog post update error:", error);
      res.status(400).json({ message: "Invalid blog post data", error });
    }
  });

  // DELETE /api/admin/blog/:id — delete blog post
  app.delete("/api/admin/blog/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) return res.status(401).json({ message: "Unauthorized" });
    try {
      const success = await blogStorage.deleteBlogPost(req.params.id);
      if (!success) return res.status(404).json({ message: "Blog post not found" });
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post", error });
    }
  });

  // GET /api/admin/blog/linking-suggestions/:id — similar posts by tags
  app.get("/api/admin/blog/linking-suggestions/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!requireAdminAuth(token)) return res.status(401).json({ message: "Unauthorized" });
    try {
      const post = await blogStorage.getBlogPostById(req.params.id);
      const tags: string[] = post ? ((post.tags as string[]) || []) : [];
      const suggestions = await blogStorage.getLinkingSuggestions(req.params.id, tags);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch linking suggestions", error });
    }
  });

  const httpServer = createServer(app);
  
  app.use("/api", aiRouter);
  
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
