import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { registerRoutes } from "./routes";
import { scheduleAutomaticScraping } from "./scraper";
import { pool } from "./db";

// Run database migrations on startup to ensure schema is up to date.
// Uses IF NOT EXISTS so it is safe to run on every boot.
async function runMigrations() {
  try {
    console.log("Running database migrations...");
    await pool.query(`
      ALTER TABLE site_settings
        ADD COLUMN IF NOT EXISTS ai_model_provider text DEFAULT 'gemini',
        ADD COLUMN IF NOT EXISTS gemini_api_key text,
        ADD COLUMN IF NOT EXISTS groq_api_key text,
        ADD COLUMN IF NOT EXISTS ollama_endpoint text DEFAULT 'http://localhost:11434',
        ADD COLUMN IF NOT EXISTS ollama_model text DEFAULT 'llama3'
    `);
    console.log("Database migrations completed successfully.");
  } catch (err) {
    // Log but don't crash — the columns may already exist or the table may not need them yet.
    console.error("Migration warning (non-fatal):", err);
  }
}

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

// Vite-free static serving function with full SEO/AEO Metadata Injection
function serveStatic(app: express.Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Helper: build JSON-LD for blog posts
  const buildBlogJsonLd = (post: any, pageUrl: string, baseUrl: string) => {
    const graph: any[] = [];

    const articleSchema: any = {
      "@type": post.schemaType || "BlogPosting",
      headline: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      image: post.ogImage || post.coverImage || `${baseUrl}/logo.png`,
      url: pageUrl,
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt || post.createdAt,
      author: {
        "@type": "Person",
        name: post.authorName || "GovtJobNow Editorial",
        ...(post.authorBio ? { description: post.authorBio } : {}),
        ...(post.authorImage ? { image: post.authorImage } : {}),
      },
      publisher: {
        "@type": "Organization",
        name: "GovtJobNow",
        url: baseUrl,
        logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      ...(post.seoKeywords ? { keywords: post.seoKeywords } : {}),
      ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
    };
    graph.push(articleSchema);

    // FAQ schema
    const faqs = Array.isArray(post.faq) ? post.faq : [];
    if (faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faqs.map((f: any) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    // BreadcrumbList
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
      ],
    });

    return { "@context": "https://schema.org", "@graph": graph };
  };

  // Helper to inject SEO metadata into index.html
  const injectMetadata = async (req: Request, res: Response) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (!fs.existsSync(indexPath)) return res.sendFile(indexPath);

    try {
      let html = fs.readFileSync(indexPath, "utf8");
      const urlPath = req.path;
      const baseUrl = process.env.BASE_URL || `https://${req.get("host")}`;

      let title = "GovtJobsNow - Official Job Portal";
      let description = "Find the latest government jobs, exam calendars, syllabus, and admit cards.";
      let image = `${baseUrl}/logo.png`;
      let pageUrl = `${baseUrl}${urlPath}`;
      let robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
      let canonical = pageUrl;
      let keywords = "government jobs, sarkari naukri, govt jobs 2025";
      let author = "GovtJobNow";
      let twitterCard = "summary_large_image";
      let jsonLd: object | null = null;

      // Webmaster verification tags from env
      const googleVerif = process.env.GOOGLE_SITE_VERIFICATION || "";
      const bingVerif = process.env.BING_SITE_VERIFICATION || "";

      // Handle Blog Post Pages
      if (urlPath.startsWith("/blog/")) {
        const slug = urlPath.replace("/blog/", "").split("/")[0];
        const { blogStorage } = await import("./blog-storage");
        const post = await blogStorage.getBlogPostBySlug(slug);

        if (post && post.status === "published") {
          title = post.seoTitle || `${post.title} | GovtJobNow Blog`;
          description = post.seoDescription || post.excerpt?.substring(0, 160) || description;
          image = post.ogImage || post.coverImage || image;
          if (image && !image.startsWith("http")) image = `${baseUrl}${image}`;
          canonical = post.canonicalUrl || pageUrl;
          robots = `${post.indexing || "index"}, ${post.follow || "follow"}`;
          keywords = post.seoKeywords || keywords;
          author = post.authorName || author;
          twitterCard = (post.twitterCard as string) || "summary_large_image";
          jsonLd = buildBlogJsonLd(post, pageUrl, baseUrl);
        }
      }
      // Handle Job Detail Pages
      else if (urlPath.startsWith("/job/")) {
        const slug = urlPath.replace("/job/", "");
        const { storage } = await import("./storage");
        const job = await storage.getJob(slug) || await storage.getJobBySlug(slug);
        if (job) {
          title = `${job.title} | ${job.department} - GovtJobNow`;
          description = job.description?.substring(0, 160) || `Apply for ${job.title} at ${job.department}.`;
          if (job.featuredImageUrl) {
            image = job.featuredImageUrl.startsWith("http") ? job.featuredImageUrl : `${baseUrl}${job.featuredImageUrl}`;
          }
          jsonLd = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "JobPosting",
                title: job.title,
                description: job.description || description,
                hiringOrganization: { "@type": "Organization", name: job.department },
                jobLocation: { "@type": "Place", name: job.location },
                validThrough: job.deadline,
                url: pageUrl,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
                  { "@type": "ListItem", position: 2, name: "Jobs", item: `${baseUrl}/` },
                  { "@type": "ListItem", position: 3, name: job.title, item: pageUrl },
                ],
              },
            ],
          };
        }
      }
      // Handle Exam Detail Pages
      else if (urlPath.startsWith("/exam/")) {
        const slug = urlPath.replace("/exam/", "");
        const { storage } = await import("./storage");
        const exam = await storage.getExam(slug) || await storage.getExamBySlug(slug);
        if (exam) {
          title = `${exam.title} - Exam Calendar | GovtJobNow`;
          description = `Important dates for ${exam.title}. Registration ends ${exam.registrationEndDate || "TBA"}.`;
          jsonLd = {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Event",
                name: exam.title,
                startDate: exam.examDate || exam.registrationStartDate,
                endDate: exam.registrationEndDate,
                url: pageUrl,
                organizer: { "@type": "Organization", name: exam.conductingOrganization || "Government" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
                  { "@type": "ListItem", position: 2, name: "Exams", item: `${baseUrl}/exams` },
                  { "@type": "ListItem", position: 3, name: exam.title, item: pageUrl },
                ],
              },
            ],
          };
        }
      }

      // ---- Build head injection string ----
      const escape = (s: string) => s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const safeTitle = escape(title);
      const safeDesc = escape(description);
      const safeKeywords = escape(keywords);

      // Replace <title>
      html = html.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`);

      // Replace existing description meta
      html = html.replace(/<meta name="description" content=".*?" \/>/, "");

      const injectionTags = [
        // Webmaster verification (only if env vars are set)
        googleVerif ? `<meta name="google-site-verification" content="${googleVerif}" />` : "",
        bingVerif ? `<meta name="msvalidate.01" content="${bingVerif}" />` : "",
        // Core meta
        `<meta name="description" content="${safeDesc}" />`,
        `<meta name="keywords" content="${safeKeywords}" />`,
        `<meta name="author" content="${escape(author)}" />`,
        `<meta name="robots" content="${robots}" />`,
        `<meta name="googlebot" content="${robots}" />`,
        // Open Graph
        `<meta property="og:title" content="${safeTitle}" />`,
        `<meta property="og:description" content="${safeDesc}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:url" content="${canonical}" />`,
        `<meta property="og:type" content="article" />`,
        `<meta property="og:site_name" content="GovtJobNow" />`,
        // Twitter
        `<meta name="twitter:card" content="${twitterCard}" />`,
        `<meta name="twitter:title" content="${safeTitle}" />`,
        `<meta name="twitter:description" content="${safeDesc}" />`,
        `<meta name="twitter:image" content="${image}" />`,
        `<meta name="twitter:site" content="@GovtJobNow" />`,
        // Canonical
        `<link rel="canonical" href="${canonical}" />`,
        // JSON-LD
        jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "",
      ].filter(Boolean).join("\n    ");

      html = html.replace("</head>", `  ${injectionTags}\n  </head>`);

      res.send(html);
    } catch (error) {
      console.error("Metadata injection error:", error);
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  };

  app.use(express.static(distPath, { index: false }));

  // Handle Dynamic Routes for Metadata
  app.get(["/job/*", "/exam/*", "/blog/*", "/blog"], injectMetadata);

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
  // Run DB migrations before starting the server
  await runMigrations();

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
