import { type InsertJob } from "@shared/schema";
import * as cron from 'node-cron';
import { UrlProcessor } from './url-processor';
import * as cheerio from 'cheerio';

// Helper function to extract job links from a webpage
function extractJobLinks($: cheerio.CheerioAPI, source: any): string[] {
  const links: string[] = [];
  const baseUrl = new URL(source.url).origin;
  
  // Common selectors for job/notification links
  const selectors = [
    'a[href*="notification"]',
    'a[href*="vacancy"]', 
    'a[href*="recruitment"]',
    'a[href*="jobs"]',
    'a[href*="career"]',
    'a[href*="employment"]',
    '.job-link a',
    '.notification-link a',
    '.vacancy-link a'
  ];
  
  selectors.forEach(selector => {
    $(selector).each((_, element) => {
      let href = $(element).attr('href');
      if (href) {
        // Convert relative URLs to absolute
        if (href.startsWith('/')) {
          href = baseUrl + href;
        } else if (!href.startsWith('http')) {
          href = baseUrl + '/' + href;
        }
        
        // Filter out non-relevant links
        if (href.includes('job') || href.includes('vacancy') || href.includes('notification') || href.includes('recruitment')) {
          links.push(href);
        }
      }
    });
  });
  
  return Array.from(new Set(links)); // Remove duplicates
}

// Helper function to normalize extracted data into InsertJob format
function normalizeJobData(data: Partial<InsertJob>, source: any, jobUrl: string): InsertJob | null {
  // Ensure minimum required fields are present
  if (!data.title || data.title.trim().length < 5) {
    return null;
  }
  
  const today = new Date();
  
  return {
    title: data.title.trim(),
    department: data.department || source.name,
    location: data.location || 'Not specified',
    qualification: data.qualification || 'As per notification',
    salary: data.salary || 'As per government norms',
    ageLimit: data.ageLimit || 'As per rules',
    applicationFee: data.applicationFee || 'As per category',
    description: data.description || 'Please refer to official notification for details.',
    selectionProcess: data.selectionProcess || 'As per notification',
    applyLink: data.applyLink || jobUrl, // Use the job page URL if no apply link found
    postedOn: data.postedOn || today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    deadline: data.deadline || 'Check official notification',
    sourceUrl: jobUrl,
    positions: data.positions || 0,
  };
}

// Helper function to validate job data quality
function isValidJobData(job: InsertJob): boolean {
  // Basic validation to ensure job is meaningful
  return (
    job.title.length > 5 &&
    job.department.length > 0 &&
    !job.title.includes('undefined') &&
    !job.title.includes('null') &&
    job.applyLink.startsWith('http')
  );
}

// Comprehensive job scraping sources including government websites and job blogs
const jobSources = [
  // Government Department Websites
  { url: "https://ssc.nic.in/portal/", name: "Staff Selection Commission", type: "government" },
  { url: "https://upsc.gov.in/", name: "Union Public Service Commission", type: "government" },
  { url: "https://ibps.in/", name: "Institute of Banking Personnel Selection", type: "government" },
  { url: "https://www.rrbcdg.gov.in/", name: "Railway Recruitment Board", type: "government" },
  { url: "https://join.army.in/", name: "Indian Army", type: "government" },
  { url: "https://joinindiannavy.gov.in/", name: "Indian Navy", type: "government" },
  { url: "https://joinindianairforce.gov.in/", name: "Indian Air Force", type: "government" },
  { url: "https://isro.gov.in/careers", name: "ISRO", type: "government" },
  { url: "https://drdo.gov.in/careers", name: "DRDO", type: "government" },
  { url: "https://nic.in/careers", name: "National Informatics Centre", type: "government" },
  
  // Banking and Financial
  { url: "https://www.sbi.co.in/careers", name: "State Bank of India", type: "banking" },
  { url: "https://www.pnb.in/careers.html", name: "Punjab National Bank", type: "banking" },
  { url: "https://www.canarabank.com/careers", name: "Canara Bank", type: "banking" },
  { url: "https://www.unionbank.in/careers", name: "Union Bank", type: "banking" },
  { url: "https://rbi.org.in/careers", name: "Reserve Bank of India", type: "banking" },
  
  // State Government Websites
  { url: "https://delhi.gov.in/employment", name: "Delhi Government", type: "state" },
  { url: "https://maharashtra.gov.in/jobs", name: "Maharashtra Government", type: "state" },
  { url: "https://tn.gov.in/employment", name: "Tamil Nadu Government", type: "state" },
  { url: "https://karnataka.gov.in/careers", name: "Karnataka Government", type: "state" },
  { url: "https://up.gov.in/employment", name: "Uttar Pradesh Government", type: "state" },
  
  // Job Blogs and Aggregators
  { url: "https://www.sarkariresult.com/", name: "Sarkari Result", type: "blog" },
  { url: "https://www.freejobalert.com/", name: "Free Job Alert", type: "blog" },
  { url: "https://www.fresherslive.com/government-jobs", name: "Freshers Live", type: "blog" },
  { url: "https://www.jagran.com/jobs/government-jobs", name: "Jagran Jobs", type: "blog" },
  { url: "https://www.naukri.com/government-jobs", name: "Naukri Government", type: "blog" }
];

// Generate realistic job data based on source type
function generateJobsForSource(source: any): InsertJob[] {
  const jobs: InsertJob[] = [];
  const today = new Date();
  
  // Generate 5-15 jobs per source to get hundreds of total jobs
  const jobCount = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < jobCount; i++) {
    const postedDate = new Date(today.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000);
    const deadlineDate = new Date(today.getTime() + (Math.random() * 45 + 15) * 24 * 60 * 60 * 1000);
    
    const jobTemplates = getJobTemplatesForSource(source);
    const template = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
    
    // Add unique identifiers to make each job unique (current date + random number)
    const uniqueId = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}_${Math.floor(Math.random() * 10000)}`;
    const currentMonth = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    jobs.push({
      title: `${template.title!} - ${currentMonth} ${uniqueId}`,
      department: template.department!,
      location: template.location!,
      qualification: template.qualification!,
      salary: template.salary!,
      ageLimit: template.ageLimit!,
      applicationFee: template.applicationFee!,
      description: template.description!,
      selectionProcess: template.selectionProcess!,
      applyLink: template.applyLink!,
      postedOn: postedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      deadline: deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      sourceUrl: `${source.url}/${uniqueId}`, // Make source URL unique too
      positions: Math.floor(Math.random() * 1000) + 50,
    });
  }
  
  return jobs;
}

function getJobTemplatesForSource(source: any): Partial<InsertJob>[] {
  const baseTemplates = {
    government: [
      {
        title: "Assistant Section Officer",
        department: source.name,
        location: "All India",
        qualification: "Graduate in any discipline",
        salary: "₹35,400 - ₹1,12,400 per month",
        ageLimit: "18-30 years",
        applicationFee: "General: ₹100, SC/ST: Nil",
        description: "Handle administrative work, manage correspondence, prepare reports and assist senior officers.",
        selectionProcess: "Written Exam, Interview, Document Verification",
        applyLink: `${source.url}/apply`
      },
      {
        title: "Junior Technical Assistant",
        department: source.name,
        location: "Multiple Locations",
        qualification: "B.E./B.Tech or Diploma in relevant field",
        salary: "₹25,500 - ₹81,100 per month",
        ageLimit: "18-32 years",
        applicationFee: "General: ₹500, Others: ₹250",
        description: "Provide technical support, maintain equipment and assist in technical operations.",
        selectionProcess: "CBT, Skill Test, Document Verification",
        applyLink: `${source.url}/technical-apply`
      },
      {
        title: "Multi Tasking Staff",
        department: source.name,
        location: "State-wise",
        qualification: "10th Pass from recognized board",
        salary: "₹18,000 - ₹56,900 per month",
        ageLimit: "18-25 years",
        applicationFee: "General: ₹100, SC/ST/PWD: Nil",
        description: "Support clerical work, maintain office premises and assist in various administrative tasks.",
        selectionProcess: "CBT, Physical Test, Medical Examination",
        applyLink: `${source.url}/mts-apply`
      }
    ],
    banking: [
      {
        title: "Probationary Officer",
        department: source.name,
        location: "Pan India",
        qualification: "Graduate in any discipline",
        salary: "₹23,700 - ₹85,000 per month",
        ageLimit: "20-30 years",
        applicationFee: "General/OBC: ₹715, Others: ₹175",
        description: "Handle banking operations, customer service, loan processing and branch management.",
        selectionProcess: "Preliminary Exam, Main Exam, Interview",
        applyLink: `${source.url}/po-apply`
      },
      {
        title: "Clerk",
        department: source.name,
        location: "State-wise",
        qualification: "12th Pass from recognized board",
        salary: "₹11,765 - ₹42,020 per month",
        ageLimit: "20-28 years",
        applicationFee: "General/OBC: ₹600, Others: ₹100",
        description: "Perform clerical work, data entry, customer assistance and account maintenance.",
        selectionProcess: "Preliminary Exam, Main Exam",
        applyLink: `${source.url}/clerk-apply`
      },
      {
        title: "Specialist Officer",
        department: source.name,
        location: "Major Cities",
        qualification: "Professional degree in relevant field",
        salary: "₹31,705 - ₹1,45,950 per month",
        ageLimit: "20-35 years",
        applicationFee: "General/OBC: ₹800, Others: ₹200",
        description: "Provide specialized services in IT, HR, Marketing, Agriculture or other domains.",
        selectionProcess: "Online Exam, Interview",
        applyLink: `${source.url}/so-apply`
      }
    ],
    state: [
      {
        title: "Police Constable",
        department: source.name,
        location: "State-wide",
        qualification: "12th Pass with Physical Standards",
        salary: "₹21,700 - ₹69,100 per month",
        ageLimit: "18-25 years",
        applicationFee: "General: ₹400, SC/ST: ₹200",
        description: "Maintain law and order, traffic management, crime prevention and public safety.",
        selectionProcess: "Written Exam, Physical Test, Medical Exam",
        applyLink: `${source.url}/police-apply`
      },
      {
        title: "Junior Engineer",
        department: source.name,
        location: "District-wise",
        qualification: "Diploma in Engineering",
        salary: "₹29,200 - ₹92,300 per month",
        ageLimit: "18-32 years",
        applicationFee: "General: ₹500, Others: ₹250",
        description: "Manage infrastructure projects, maintain public works and supervise construction.",
        selectionProcess: "Technical Exam, Interview, Document Verification",
        applyLink: `${source.url}/je-apply`
      },
      {
        title: "Village Revenue Officer",
        department: source.name,
        location: "Rural Areas",
        qualification: "Graduate with computer knowledge",
        salary: "₹25,500 - ₹81,100 per month",
        ageLimit: "18-30 years",
        applicationFee: "General: ₹300, SC/ST: ₹150",
        description: "Maintain land records, revenue collection, village administration and public grievances.",
        selectionProcess: "Written Exam, Computer Test, Interview",
        applyLink: `${source.url}/vro-apply`
      }
    ],
    blog: [
      {
        title: "Teaching Assistant",
        department: "Various Educational Institutions",
        location: "Multiple States",
        qualification: "Post Graduate in relevant subject",
        salary: "₹35,400 - ₹1,12,400 per month",
        ageLimit: "21-35 years",
        applicationFee: "As per recruitment rules",
        description: "Assist professors in teaching, research activities and academic administration.",
        selectionProcess: "NET/SET, Interview, Document Verification",
        applyLink: `${source.url}/teaching-apply`
      },
      {
        title: "Forest Guard",
        department: "Forest Department",
        location: "Forest Areas",
        qualification: "10th Pass with forest knowledge",
        salary: "₹19,900 - ₹63,200 per month",
        ageLimit: "18-25 years",
        applicationFee: "General: ₹200, SC/ST: ₹100",
        description: "Protect forests, wildlife conservation, prevent illegal activities and maintain forest records.",
        selectionProcess: "Written Exam, Physical Test, Medical Exam",
        applyLink: `${source.url}/forest-apply`
      },
      {
        title: "Data Entry Operator",
        department: "Various Government Offices",
        location: "Office Locations",
        qualification: "12th Pass with computer skills",
        salary: "₹19,900 - ₹63,200 per month",
        ageLimit: "18-27 years",
        applicationFee: "General: ₹300, Others: ₹150",
        description: "Enter data, maintain records, computer operations and office support work.",
        selectionProcess: "Computer Test, Typing Test, Interview",
        applyLink: `${source.url}/data-entry-apply`
      }
    ]
  };
  
  return baseTemplates[source.type as keyof typeof baseTemplates] || baseTemplates.government;
}

// Enhanced scraping function that generates realistic job data
async function scrapeJobsFromSource(source: any): Promise<InsertJob[]> {
  const urlProcessor = new UrlProcessor();
  
  try {
    console.log(`Scraping ${source.name} (${source.url})...`);
    
    // Fetch and parse the webpage
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
      // Note: Node.js fetch doesn't support timeout option, would need AbortController for timeouts
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract job links from the page
    const jobLinks = extractJobLinks($, source);
    console.log(`  Found ${jobLinks.length} potential job links from ${source.name}`);
    const jobs: InsertJob[] = [];
    
    if (jobLinks.length === 0) {
      console.log(`  No job links found on ${source.url}`);
      return jobs;
    }
    
    // Process each job link (limit to prevent overwhelming)
    const maxJobs = Math.min(jobLinks.length, 10); // Limit to 10 jobs per source
    console.log(`  Processing ${maxJobs} job links...`);
    
    for (let i = 0; i < maxJobs; i++) {
      try {
        const jobUrl = jobLinks[i];
        console.log(`  Processing job: ${jobUrl}`);
        
        const result = await urlProcessor.processUrl(jobUrl);
        
        if (result.success && result.data) {
          const jobData = normalizeJobData(result.data, source, jobUrl);
          if (jobData && isValidJobData(jobData)) {
            jobs.push(jobData);
          }
        }
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`  Failed to process job link: ${error instanceof Error ? error.message : 'Unknown error'}`);
        continue;
      }
    }
    
    // If no real jobs found, don't generate fake ones
    console.log(`✅ Found ${jobs.length} real jobs from ${source.name}`);
    
    return jobs;
    
  } catch (error) {
    console.error(`Failed to scrape ${source.name}:`, error instanceof Error ? error.message : 'Unknown error');
    return []; // Return empty array instead of fake jobs
  }
}

export async function scrapeJobs(): Promise<InsertJob[]> {
  const allJobs: InsertJob[] = [];
  
  console.log("Starting comprehensive job scraping across multiple sources...");
  
  // Scrape from all job sources
  for (const source of jobSources) {
    try {
      const jobs = await scrapeJobsFromSource(source);
      allJobs.push(...jobs);
      
      // Add delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to scrape ${source.name}:`, error);
    }
  }
  
  console.log(`Scraping completed. Total jobs found: ${allJobs.length} from ${jobSources.length} sources`);
  return allJobs;
}

// Global flag to prevent concurrent scraping runs
let isScrapingRunning = false;

// Schedule scraping 3 times daily using reliable cron scheduling: 6 AM, 2 PM, 10 PM
export function scheduleAutomaticScraping() {
  console.log("Setting up automatic job scraping 3 times daily using cron scheduler...");
  console.log("Scheduled times: 6:00 AM, 2:00 PM, 10:00 PM (IST)");
  
  // Run initial scraping after 10 seconds (startup delay)
  setTimeout(async () => {
    console.log("Running initial startup job scraping...");
    await runScheduledScraping();
  }, 10000);
  
  
  // Schedule 3 times daily at specific times (IST)
  // At 6:00 AM IST
  cron.schedule('0 6 * * *', async () => {
    console.log("🌅 Running morning job scraping (6:00 AM IST)...");
    await runScheduledScraping();
  }, {
    timezone: "Asia/Kolkata"
  });
  
  // At 2:00 PM IST
  cron.schedule('0 14 * * *', async () => {
    console.log("🌞 Running afternoon job scraping (2:00 PM IST)...");
    await runScheduledScraping();
  }, {
    timezone: "Asia/Kolkata"
  });
  
  // At 10:00 PM IST
  cron.schedule('0 22 * * *', async () => {
    console.log("🌙 Running evening job scraping (10:00 PM IST)...");
    await runScheduledScraping();
  }, {
    timezone: "Asia/Kolkata"
  });
  
  // Optional test schedule (only in development)
  if (process.env.NODE_ENV === 'development' && process.env.ENABLE_TEST_SCRAPE === 'true') {
    cron.schedule('*/30 * * * *', async () => {
      console.log("⚡ Running test scraping (every 30 minutes for development)...");
      await runScheduledScraping();
    });
    console.log("✅ Cron jobs scheduled! Next runs: 6:00 AM, 2:00 PM, 10:00 PM IST + every 30 min (dev only)");
  } else {
    console.log("✅ Cron jobs scheduled! Next runs: 6:00 AM, 2:00 PM, 10:00 PM IST");
  }
}

async function runScheduledScraping() {
  // Reentrancy guard: Skip if another scraping is already in progress
  if (isScrapingRunning) {
    console.log("⏸️  Skipping scheduled scraping - another run is already in progress");
    return;
  }
  
  isScrapingRunning = true;
  
  try {
    const now = new Date();
    const istTime = now.toLocaleString('en-US', { 
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    console.log(`🚀 Running scheduled job scraping at ${istTime} (IST)...`);
    const startTime = Date.now();
    
    const { storage } = await import('./storage');
    const jobs = await scrapeJobs();
    
    // Store all scraped jobs in database
    let newJobsCount = 0;
    let duplicateJobsCount = 0;
    
    for (const jobData of jobs) {
      try {
        // Check if job already exists before creating
        const statsBefore = await storage.getJobStats();
        await storage.createJob(jobData);
        const statsAfter = await storage.getJobStats();
        
        // If count increased, it's a new job; otherwise it's a duplicate
        if (statsAfter.totalJobs > statsBefore.totalJobs) {
          newJobsCount++;
        } else {
          duplicateJobsCount++;
        }
      } catch (error) {
        // Error occurred during creation
        duplicateJobsCount++;
        console.error("Error creating job:", error);
      }
    }
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log(`✅ Scheduled scraping completed successfully!`);
    console.log(`📊 Results: ${newJobsCount} new jobs added, ${duplicateJobsCount} duplicates skipped`);
    console.log(`⏱️  Total time taken: ${duration} seconds`);
    console.log(`📈 Total jobs processed: ${jobs.length} from ${jobSources.length} sources`);
    console.log(`⏰ Next scheduled runs: 6:00 AM, 2:00 PM, 10:00 PM (IST)`);
    console.log('─'.repeat(80));
    
  } catch (error) {
    console.error("❌ Scheduled scraping failed:", error);
    console.log('─'.repeat(80));
  } finally {
    // Always release the lock
    isScrapingRunning = false;
  }
}

// Helper function to clean up expired jobs
async function cleanupExpiredJobs() {
  try {
    const { db } = await import('./db');
    const { jobs } = await import('@shared/schema');
    const { lt, sql } = await import('drizzle-orm');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Delete jobs that are more than 60 days old
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const result = await db.delete(jobs)
      .where(lt(jobs.createdAt, sixtyDaysAgo));
      
    console.log(`Cleaned up ${result.rowCount} expired jobs`);
  } catch (error) {
    console.error("Failed to cleanup expired jobs:", error);
  }
}
