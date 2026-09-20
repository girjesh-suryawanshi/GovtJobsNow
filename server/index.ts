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
  if (!pool) return;
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

      // Handle Dynamic Routes for Metadata and Pre-rendered HTML for Crawlers
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
                // Only emit validThrough if deadline is in the future (avoids stale schema signal)
                ...(job.deadline && new Date(job.deadline) > new Date()
                  ? { validThrough: new Date(job.deadline).toISOString() }
                  : {}),
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
      else if (urlPath === "/about-us") {
        title = "About Us | GovtJobNow - Trusted Government Job Portal";
        description = "Learn about GovtJobNow mission to provide 100% verified government job notifications, exam calendars, and career guidance for Indian aspirants.";
      }
      else if (urlPath === "/privacy-policy") {
        title = "Privacy Policy | GovtJobNow";
        description = "GovtJobNow privacy policy detailing data protection, cookie usage, user privacy rights, and analytics practices.";
      }
      else if (urlPath === "/terms-of-service") {
        title = "Terms of Service | GovtJobNow";
        description = "Terms of service and usage guidelines for accessing government job notifications and educational services on GovtJobNow.";
      }
      else if (urlPath === "/disclaimer") {
        title = "Official Disclaimer | GovtJobNow";
        description = "Official recruitment disclaimer confirming GovtJobNow is an independent informational portal and not affiliated with government agencies.";
      }
      else if (urlPath === "/contact") {
        title = "Contact Us | GovtJobNow Editorial & Support";
        description = "Get in touch with GovtJobNow editorial team for job verification inquiries, corrections, media requests, or user support.";
      }
      else if (urlPath === "/faq") {
        title = "Frequently Asked Questions (FAQ) | GovtJobNow";
        description = "Answers to common questions regarding government recruitment notifications, eligibility criteria, admit cards, and application tracking.";
      }
      else if (urlPath === "/blog") {
        title = "Sarkari Job Preparation Blog & Career News | GovtJobNow";
        description = "In-depth career guides, exam preparation strategies, syllabus analysis, and recruitment news for Indian government job aspirants.";
      }
      else if (urlPath === "/exams") {
        title = "Government Exam Calendar & Schedule 2026 | GovtJobNow";
        description = "Track key exam dates, application deadlines, admit card release schedules, and result dates for SSC, UPSC, Banking, and Railway exams.";
      }
      else if (urlPath === "/redirect") {
        // Standalone redirect notice page has no unique content value — noindex it
        robots = "noindex, follow";
        title = "Redirecting to Official Site | GovtJobNow";
        description = "You are being redirected to an official government recruitment portal.";
      }
      else {
        // Dynamic SEO landing pages or general routes
        const cleanSlug = urlPath.replace("/", "").replace(/-/g, " ");
        if (cleanSlug) {
          const capitalized = cleanSlug.replace(/\b\w/g, l => l.toUpperCase());
          title = `${capitalized} 2026 - Notification, Syllabus & Apply Online | GovtJobNow`;
          description = `Latest ${capitalized} notifications, eligibility criteria, age limit, salary details, and step-by-step application process for 2026.`;
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

      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GovtJobNow",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

      const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GovtJobNow",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "publishingPrinciples": `${baseUrl}/editorial-policy`,
        "correctionsPolicy": `${baseUrl}/corrections`,
        "knowsAbout": [
          "Government Recruitment Notifications",
          "Staff Selection Commission (SSC) Jobs",
          "Railway Recruitment Boards (RRB) Jobs",
          "UPSC Civil Services Examination",
          "Sarkari Naukri Gazette Verification"
        ],
        "sameAs": [
          "https://www.facebook.com/Dailygovtjobsalert",
          "https://x.com/dailygovtjobs",
          "https://www.instagram.com/dailygovtjobsalert/"
        ]
      };

      const injectionTags = [
        // Webmaster verification (only if env vars are set)
        googleVerif ? `<meta name="google-site-verification" content="${googleVerif}" />` : "",
        bingVerif ? `<meta name="msvalidate.01" content="${bingVerif}" />` : "",
        `<meta name="google-adsense-account" content="ca-pub-1815096689563523" />`,
        `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1815096689563523" crossorigin="anonymous"></script>`,

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
        // JSON-LD Schemas (SEO, AEO, GEO)
        `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`,
        `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`,
        jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "",
      ].filter(Boolean).join("\n    ");

      html = html.replace("</head>", `  ${injectionTags}\n  </head>`);

      // Pre-render lightweight HTML fallback inside <div id="root"> for non-JS crawlers (Mediapartners-Google)
      const initialContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 1100px; margin: 0 auto; padding: 20px; color: #1e293b;">
          <header style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #2563eb; font-size: 28px; margin: 0 0 8px 0;">${safeTitle}</h1>
            <p style="color: #475569; font-size: 16px; margin: 0;">${safeDesc}</p>
          </header>
          <nav style="margin-bottom: 24px;">
            <a href="/" style="color: #2563eb; text-decoration: none; font-weight: bold; margin-right: 16px;">Home</a>
            <a href="/blog" style="color: #2563eb; text-decoration: none; font-weight: bold; margin-right: 16px;">Blog</a>
            <a href="/exams" style="color: #2563eb; text-decoration: none; font-weight: bold; margin-right: 16px;">Exam Calendar</a>
            <a href="/jobs/ssc" style="color: #2563eb; text-decoration: none; font-weight: bold; margin-right: 16px;">SSC Jobs</a>
            <a href="/jobs/railway" style="color: #2563eb; text-decoration: none; font-weight: bold; margin-right: 16px;">Railway Jobs</a>
            <a href="/about-us" style="color: #2563eb; text-decoration: none; font-weight: bold;">About Us</a>
          </nav>
          <main style="line-height: 1.7; font-size: 16px;">
            <section style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <h2 style="font-size: 20px; margin-top: 0; color: #0f172a;">Government Recruitment & Job Alerts Portal</h2>
              <p>GovtJobNow is India's dedicated informational platform providing verified government job notifications, eligibility criteria, exam schedules, syllabus guidelines, and official application links across Central and State departments (SSC, Railway RRB, UPSC, Banking, Defence, and PSU sectors).</p>
            </section>
          </main>
          <footer style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
            <p>© 2026 GovtJobNow. All rights reserved. | <a href="/privacy-policy" style="color: #2563eb;">Privacy Policy</a> | <a href="/terms-of-service" style="color: #2563eb;">Terms of Service</a> | <a href="/disclaimer" style="color: #2563eb;">Disclaimer</a> | <a href="/contact" style="color: #2563eb;">Contact Us</a></p>
          </footer>
        </div>
      `;

      // Replace the root div content — match with or without skeleton HTML inside
      html = html.replace(/<div id="root">([\s\S]*?)<\/div>/, `<div id="root">${initialContent}</div>`);

      res.send(html);
    } catch (error) {
      console.error("Metadata injection error:", error);
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  };

  app.use(express.static(distPath, { index: false }));

  // Handle Dynamic & Static Routes for Metadata + HTML injection
  app.get("*", injectMetadata);
}


const app = express();

// Trust proxy for proper client IP handling behind Nginx
app.set('trust proxy', 1);

// ── Google AdSense / Preview Compatibility Headers ──────────────────────────
// Remove X-Frame-Options so Google AdSense can preview the site in an iframe.
// Set CSP frame-ancestors to allow adsense.google.com preview tool.
app.use((_req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self' https: data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      // Allow Google AdSense preview tool (adsense.google.com) to iframe this site
      "frame-ancestors 'self' https://adsense.google.com https://www.google.com",
    ].join('; ')
  );
  next();
});
// ─────────────────────────────────────────────────────────────────────────────

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
