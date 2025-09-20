import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, searchJobsSchema, adminLoginSchema, processUrlSchema, userLoginSchema, userRegisterSchema, adminPasswordChangeSchema, createAdminUserSchema, updateJobSchema } from "@shared/schema";
import { scrapeJobs } from "./scraper";
import { adminStorage } from "./admin-storage";
import { urlProcessor } from "./url-processor";
import { requireAdminAuth, createAdminSession, verifyPassword, revokeAdminSession } from "./admin-auth";
import { createUserSession, hashPassword, verifyPassword as verifyUserPassword, requireUserAuth, revokeUserSession } from "./user-auth";
import { hashPassword as hashAdminPassword } from "./admin-auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job", error });
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

  // Admin manual job creation
  app.post("/api/admin/jobs", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);
    
    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
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
    } catch (error) {
      console.error("Failed to create manual job:", error);
      res.status(400).json({ 
        message: "Invalid job data", 
        error: error instanceof Error ? error.message : error 
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
          console.error(`Required field ${field} is missing or null:`, fieldValue);
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

  // Get all admin users
  app.get("/api/admin/users", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const adminId = requireAdminAuth(token);
    
    if (!adminId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const adminUsers = await adminStorage.getAllAdminUsers();
      
      // Remove password field from response
      const safeUsers = adminUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }));
      
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin users", error });
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
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-jobs.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${currentDate}</lastmod>
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
