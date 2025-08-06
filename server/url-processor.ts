import * as cheerio from "cheerio";
import type { InsertJob, ExtractionTemplate } from "@shared/schema";

interface ExtractedJobData {
  title?: string;
  department?: string;
  location?: string;
  qualification?: string;
  deadline?: string;
  applyLink?: string;
  postedOn?: string;
  positions?: number;
  salary?: string;
  ageLimit?: string;
  applicationFee?: string;
  description?: string;
  selectionProcess?: string;
}

export class UrlProcessor {
  private defaultTemplates: ExtractionTemplate[] = [
    {
      id: "sarkari-result",
      name: "Sarkari Result",
      domain: "sarkariresult.com",
      selectors: {
        title: "h1, .job-title, .post-title",
        department: ".dept, .department, .organization",
        location: ".location, .job-location",
        qualification: ".qualification, .eligibility, .education",
        deadline: ".deadline, .last-date, .important-date",
        salary: ".salary, .pay-scale, .stipend",
        positions: ".vacancy, .posts, .positions",
        description: ".job-description, .details, .content"
      },
      patterns: {
        salary: /(?:salary|pay|stipend)[\s:]*₹?[\d,]+(?:\s*-\s*₹?[\d,]+)?/i,
        deadline: /(?:last date|deadline)[\s:]*\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/i,
        positions: /(?:vacancy|posts)[\s:]*(\d+)/i
      },
      isActive: true,
      successRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "free-job-alert",
      name: "Free Job Alert",
      domain: "freejobalert.com",
      selectors: {
        title: "h1, .entry-title",
        department: ".company, .dept",
        location: ".location",
        qualification: ".qualification",
        deadline: ".last-date",
        salary: ".salary",
        description: ".entry-content"
      },
      patterns: {
        salary: /₹[\d,]+(?:\s*-\s*₹?[\d,]+)?/i,
        deadline: /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/i
      },
      isActive: true,
      successRate: 80,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "government-portal",
      name: "Government Portal Generic",
      domain: "*",
      selectors: {
        title: "h1, h2, .title, .job-title",
        department: ".department, .ministry, .organization",
        location: ".location, .place",
        qualification: ".qualification, .eligibility",
        deadline: ".deadline, .last-date, .closing-date",
        salary: ".salary, .pay, .remuneration"
      },
      patterns: {
        title: /(?:recruitment|notification|vacancy|posts?)\s+(?:for\s+)?(.+)/i,
        deadline: /(?:last\s+date|deadline|closing\s+date)[\s:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i
      },
      isActive: true,
      successRate: 70,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async fetchUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getTemplateForUrl(url: string): ExtractionTemplate {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Find specific domain template
    const domainTemplate = this.defaultTemplates.find(
      t => t.domain !== "*" && domain.includes(t.domain)
    );
    
    if (domainTemplate) return domainTemplate;
    
    // Fall back to generic template
    return this.defaultTemplates.find(t => t.domain === "*")!;
  }

  extractTextContent($: cheerio.CheerioAPI, selectors: string[]): string {
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        return element.text().trim();
      }
    }
    return "";
  }

  extractWithPattern(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[1] || match[0] : "";
  }

  normalizeJobData(data: ExtractedJobData, sourceUrl: string): Partial<InsertJob> {
    const now = new Date().toLocaleDateString("en-GB");
    
    return {
      title: data.title || "Government Job Opportunity",
      department: data.department || this.extractDepartmentFromUrl(sourceUrl) || "Government Department",
      location: data.location || "India",
      qualification: data.qualification || "As per official notification",
      deadline: this.normalizeDate(data.deadline) || "Check official notification",
      applyLink: sourceUrl,
      postedOn: now,
      sourceUrl: sourceUrl,
      positions: data.positions || 1,
      salary: data.salary || "As per government norms",
      ageLimit: data.ageLimit,
      applicationFee: data.applicationFee,
      description: data.description,
      selectionProcess: data.selectionProcess
    };
  }

  extractDepartmentFromUrl(url: string): string {
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Government department mapping
    const deptMap: Record<string, string> = {
      'ssc.nic.in': 'Staff Selection Commission',
      'upsc.gov.in': 'Union Public Service Commission',
      'ibps.in': 'Institute of Banking Personnel Selection',
      'rrbcdg.gov.in': 'Railway Recruitment Board',
      'sbi.co.in': 'State Bank of India',
      'rbi.org.in': 'Reserve Bank of India',
      'isro.gov.in': 'ISRO',
      'drdo.gov.in': 'DRDO'
    };

    for (const [domain, dept] of Object.entries(deptMap)) {
      if (hostname.includes(domain)) return dept;
    }

    return "";
  }

  normalizeDate(dateStr?: string): string {
    if (!dateStr) return "";
    
    // Try to parse various date formats
    const datePatterns = [
      /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/,
      /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{2,4})/i
    ];
    
    for (const pattern of datePatterns) {
      const match = dateStr.match(pattern);
      if (match) {
        try {
          let [, day, month, year] = match;
          
          if (isNaN(Number(month))) {
            // Convert month name to number
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                          'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            month = (months.findIndex(m => month.toLowerCase().startsWith(m)) + 1).toString();
          }
          
          if (year.length === 2) {
            year = '20' + year;
          }
          
          const date = new Date(Number(year), Number(month) - 1, Number(day));
          return date.toLocaleDateString("en-GB");
        } catch {
          // Continue to next pattern
        }
      }
    }
    
    return dateStr;
  }

  async processUrl(url: string, templateId?: string): Promise<{ 
    success: boolean; 
    data?: Partial<InsertJob>; 
    error?: string;
    processingTimeMs: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Validate URL
      new URL(url);
      
      // Fetch content
      const html = await this.fetchUrl(url);
      const $ = cheerio.load(html);
      
      // Get appropriate template
      const template = this.getTemplateForUrl(url);
      
      // Extract data using template
      const extractedData: ExtractedJobData = {};
      
      // Extract using CSS selectors
      Object.entries(template.selectors as Record<string, string>).forEach(([field, selector]) => {
        const selectors = Array.isArray(selector) ? selector : [selector];
        const content = this.extractTextContent($, selectors);
        if (content) {
          (extractedData as any)[field] = content;
        }
      });
      
      // Apply regex patterns for better extraction
      const fullText = $.text();
      if (template.patterns) {
        Object.entries(template.patterns as Record<string, RegExp>).forEach(([field, pattern]) => {
          const match = this.extractWithPattern(fullText, pattern);
          if (match && !extractedData[field as keyof ExtractedJobData]) {
            (extractedData as any)[field] = match;
          }
        });
      }
      
      // Enhance extraction with intelligent parsing
      await this.enhanceExtraction(extractedData, $, fullText);
      
      // Normalize and validate data
      const normalizedData = this.normalizeJobData(extractedData, url);
      
      const processingTimeMs = Date.now() - startTime;
      
      return {
        success: true,
        data: normalizedData,
        processingTimeMs
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTimeMs: Date.now() - startTime
      };
    }
  }

  private async enhanceExtraction(data: ExtractedJobData, $: cheerio.CheerioAPI, fullText: string): Promise<void> {
    // Smart title extraction if not found
    if (!data.title) {
      const titleCandidates = [
        $('title').text(),
        $('h1').first().text(),
        $('h2').first().text()
      ].filter(Boolean);
      
      for (const candidate of titleCandidates) {
        if (this.isValidJobTitle(candidate)) {
          data.title = candidate.trim();
          break;
        }
      }
    }
    
    // Smart deadline extraction
    if (!data.deadline) {
      const deadlineRegex = /(?:last\s+date|deadline|closing\s+date|apply\s+by)[\s:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/gi;
      const matches = Array.from(fullText.matchAll(deadlineRegex));
      if (matches.length > 0) {
        data.deadline = matches[0][1];
      }
    }
    
    // Smart qualification extraction
    if (!data.qualification) {
      const qualRegex = /(graduation|graduate|12th|10th|diploma|degree|b\.?tech|b\.?e\.?|m\.?tech|mba|ca|cs)/gi;
      const matches = Array.from(fullText.matchAll(qualRegex));
      if (matches.length > 0) {
        data.qualification = matches[0][0];
      }
    }
    
    // Smart salary extraction
    if (!data.salary) {
      const salaryRegex = /₹\s*[\d,]+(?:\s*-\s*₹?\s*[\d,]+)?(?:\s*per\s+month)?/gi;
      const matches = Array.from(fullText.matchAll(salaryRegex));
      if (matches.length > 0) {
        data.salary = matches[0][0];
      }
    }
    
    // Extract number of positions
    if (!data.positions) {
      const posRegex = /(?:vacancy|vacancies|posts?|positions?)[\s:]*(\d+)/gi;
      const matches = Array.from(fullText.matchAll(posRegex));
      if (matches.length > 0) {
        data.positions = parseInt(matches[0][1]);
      }
    }
  }

  private isValidJobTitle(title: string): boolean {
    const jobKeywords = [
      'recruitment', 'vacancy', 'notification', 'posts', 'jobs', 'hiring',
      'officer', 'clerk', 'assistant', 'manager', 'engineer', 'teacher'
    ];
    
    return jobKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    ) && title.length > 10 && title.length < 200;
  }
}

export const urlProcessor = new UrlProcessor();