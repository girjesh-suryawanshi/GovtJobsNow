import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { registerRoutes } from "./routes";
import { scheduleAutomaticScraping } from "./scraper";

// Local log function (vite-free)
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Vite-free static serving function with Dynamic OG Metadata Injection
function serveStatic(app: express.Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Helper to inject SEO metadata into index.html
  const injectMetadata = async (req: Request, res: Response) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (!fs.existsSync(indexPath)) return res.sendFile(indexPath);

    try {
      let html = fs.readFileSync(indexPath, "utf8");
      const urlPath = req.path;
      const baseUrl = process.env.BASE_URL || `https://${req.get('host')}`;
      
      let title = "GovtJobsNow - Official Job Portal";
      let description = "Find the latest government jobs, exam calendars, syllabus, and admit cards.";
      let image = `${baseUrl}/logo.png`;
      let pageUrl = `${baseUrl}${urlPath}`;

      // Handle Job Detail Pages
      if (urlPath.startsWith("/job/")) {
        const slug = urlPath.replace("/job/", "");
        const { storage } = await import("./storage");
        const job = await storage.getJob(slug) || await storage.getJobBySlug(slug);
        
        if (job) {
          title = `${job.title} | ${job.department} - GovtJobNow`;
          description = job.description?.substring(0, 160) || `Apply for ${job.title} at ${job.department}. Check eligibility, salary, and last date here.`;
          if (job.featuredImageUrl) {
            image = job.featuredImageUrl.startsWith("http") ? job.featuredImageUrl : `${baseUrl}${job.featuredImageUrl}`;
          }
        }
      } 
      // Handle Exam Detail Pages
      else if (urlPath.startsWith("/exam/")) {
        const slug = urlPath.replace("/exam/", "");
        const { storage } = await import("./storage");
        const exam = await storage.getExam(slug) || await storage.getExamBySlug(slug);
        
        if (exam) {
          title = `${exam.title} - Exam Calendar | GovtJobNow`;
          description = `Important dates and details for ${exam.title}. Registration ends on ${exam.registrationEndDate || 'TBA'}.`;
        }
      }

      // Replace Meta Tags
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);
      
      // Inject OG Tags
      const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`;
      
      html = html.replace("</head>", `${ogTags}\n  </head>`);
      
      res.send(html);
    } catch (error) {
      console.error("Metadata injection error:", error);
      res.sendFile(indexPath);
    }
  };

  app.use(express.static(distPath, { index: false }));

  // Handle Dynamic Routes for Metadata
  app.get(["/job/*", "/exam/*"], injectMetadata);

  // Fallback for all other routes
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

const app = express();

// Trust proxy for proper client IP handling behind Nginx
app.set('trust proxy', 1);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Start automatic job scraping
  scheduleAutomaticScraping();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Default to 3000 for production consistency with Docker configuration.
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
