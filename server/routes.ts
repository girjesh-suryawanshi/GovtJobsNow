import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, searchJobsSchema } from "@shared/schema";
import { scrapeJobs } from "./scraper";

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

  const httpServer = createServer(app);
  return httpServer;
}
