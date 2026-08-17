import { type User, type InsertUser, type Job, type InsertJob, type SearchJobsParams, type JobPosition, type InsertJobPosition, type CreateJobWithPositions, type Exam, type InsertExam, type SiteSettings, type InsertSiteSettings, jobs, users, jobPositions, exams, urlProcessingLogs, extractionTemplates, siteAnalytics, visitorLogs, siteSettings, insertJobSchema, insertJobPositionSchema } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, gte, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  
  // Job-related methods
  getJob(id: string): Promise<Job | undefined>;
  getJobBySlug(slug: string): Promise<Job | undefined>;
  getAllJobs(limit?: number): Promise<Job[]>;
  searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }>;
  searchJobsForRAG(query: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  createJobWithPositions(jobData: any): Promise<Job>;
  getJobPositions(jobId: string): Promise<JobPosition[]>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  getJobStats(): Promise<{
    totalJobs: number;
    newToday: number;
    departments: number;
    applications: number;
  }>;
  getRelatedJobs(jobId: string, category?: string, department?: string, limit?: number): Promise<Job[]>;
  getTrendingJobs(limit?: number): Promise<Job[]>;
  incrementJobViewCount(jobId: string): Promise<void>;
  getDepartmentCounts(): Promise<Record<string, number>>;

  // Exam-related methods
  getExam(id: string): Promise<Exam | undefined>;
  getExamBySlug(slug: string): Promise<Exam | undefined>;
  getAllExams(): Promise<Exam[]>;
  searchExamsForRAG(query: string): Promise<Exam[]>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: string): Promise<boolean>;

  // URL Processing methods
  getUrlProcessingLogs(adminId: string): Promise<any[]>;
  getExtractionTemplates(): Promise<any[]>;
  createUrlProcessingLog(log: any): Promise<any>;

  // Site Analytics methods
  getVisitorStats(): Promise<{ totalVisitors: number; uniqueVisitors: number }>;
  recordVisitor(ipHash: string, isUnique: boolean): Promise<void>;

  // Site Settings methods
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;
  private jobPositions: Map<string, JobPosition>;
  private exams: Map<string, Exam>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.jobPositions = new Map();
    this.exams = new Map();
    this.seedSampleData();
  }

  private seedSampleData() {
    const sampleJobs: Job[] = [
      {
        id: "1",
        title: "SSC CGL Recruitment 2026 Notification",
        slug: "ssc-cgl-recruitment-2026",
        department: "Staff Selection Commission (SSC)",
        recruitingOrganization: "Staff Selection Commission",
        jobCategory: "Central Govt",
        location: "All India",
        qualification: "Graduate Degree in any discipline",
        positions: "17727",
        salary: "Rs. 25,500 - Rs. 1,42,400/- (Pay Level 4 to Level 8)",
        deadline: "2026-10-31",
        description: "### SSC CGL 2026 Notification\nStaff Selection Commission (SSC) invites applications for Combined Graduate Level Examination (CGL) 2026 for recruitment to various Group B and C posts in Ministries/Departments of Government of India.",
        sourceUrl: "https://ssc.gov.in",
        featuredImageUrl: null,
        isFeatured: true,
        viewCount: 1540,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        title: "RRB NTPC Recruitment 2026 (Graduate & Undergraduate)",
        slug: "rrb-ntpc-recruitment-2026",
        department: "Indian Railways (RRB)",
        recruitingOrganization: "Railway Recruitment Boards",
        jobCategory: "Railway",
        location: "All India",
        qualification: "12th Pass / Graduate",
        positions: "11558",
        salary: "Rs. 19,900 - Rs. 35,400/- per month",
        deadline: "2026-09-30",
        description: "### Railway RRB NTPC Recruitment 2026\nRailway Recruitment Board invites online applications for Non-Technical Popular Categories (NTPC) posts including Junior Clerk, Goods Train Manager, and Senior Clerk.",
        sourceUrl: "https://indianrailways.gov.in",
        featuredImageUrl: null,
        isFeatured: true,
        viewCount: 2310,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        title: "UPSC Civil Services Examination (CSE) 2026",
        slug: "upsc-civil-services-2026",
        department: "Union Public Service Commission (UPSC)",
        recruitingOrganization: "UPSC",
        jobCategory: "UPSC",
        location: "All India",
        qualification: "Bachelor Degree in any stream",
        positions: "1056",
        salary: "Rs. 56,100/- (Pay Level 10)",
        deadline: "2026-11-15",
        description: "### UPSC IAS/IFS Notification 2026\nUnion Public Service Commission released the official notice for Civil Services Preliminary Examination 2026 for IAS, IPS, IFS, and Central Services.",
        sourceUrl: "https://upsc.gov.in",
        featuredImageUrl: null,
        isFeatured: true,
        viewCount: 3890,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        title: "SBI Probationary Officer (PO) Recruitment 2025 (Expired Notice)",
        slug: "sbi-po-recruitment-2025",
        department: "State Bank of India (SBI)",
        recruitingOrganization: "State Bank of India",
        jobCategory: "Bank",
        location: "All India",
        qualification: "Graduation Degree",
        positions: "2000",
        salary: "Rs. 41,960/- plus allowances",
        deadline: "2025-06-30",
        description: "### SBI PO Recruitment 2025\nState Bank of India invited online applications for Probationary Officers in SBI branches across India. The application portal is currently closed.",
        sourceUrl: "https://sbi.co.in",
        featuredImageUrl: null,
        isFeatured: false,
        viewCount: 920,
        createdAt: new Date(2025, 5, 1),
        updatedAt: new Date(2025, 5, 1)
      }
    ];

    sampleJobs.forEach(job => this.jobs.set(job.id, job));
  }


  async getUser(id: string): Promise<User | undefined> { return this.users.get(id); }
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user = { ...insertUser, id, isActive: true, createdAt: new Date(), updatedAt: new Date(), phone: insertUser.phone || null };
    this.users.set(id, user as User);
    return user as User;
  }
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }
  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllExams(): Promise<Exam[]> {
    return Array.from(this.exams.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  async searchExamsForRAG(query: string): Promise<Exam[]> {
    const q = query.toLowerCase();
    return Array.from(this.exams.values())
      .filter(e => e.title.toLowerCase().includes(q))
      .slice(0, 3);
  }

  async getJob(id: string): Promise<Job | undefined> { return this.jobs.get(id); }
  async getJobBySlug(slug: string): Promise<Job | undefined> {
    return Array.from(this.jobs.values()).find(j => j.slug === slug);
  }
  async getAllJobs(limit?: number): Promise<Job[]> {
    const sorted = Array.from(this.jobs.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }
  async searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }> { return { jobs: Array.from(this.jobs.values()), total: this.jobs.size }; }
  async searchJobsForRAG(query: string): Promise<Job[]> {
    const q = query.toLowerCase();
    return Array.from(this.jobs.values())
      .filter(j => j.title.toLowerCase().includes(q) || (j.department && j.department.toLowerCase().includes(q)))
      .slice(0, 3);
  }
  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job = { ...insertJob, id, createdAt: new Date(), positions: insertJob.positions || "1", viewCount: 0 } as Job;
    this.jobs.set(id, job);
    return job;
  }
  async createJobWithPositions(jobData: any): Promise<Job> {
    const { jobPositions: positions, ...mainJobData } = jobData;
    const job = await this.createJob(mainJobData);
    if (positions) {
      positions.forEach((p: any) => {
        const pid = randomUUID();
        this.jobPositions.set(pid, { ...p, id: pid, jobId: job.id, createdAt: new Date() });
      });
    }
    return job;
  }
  async getJobPositions(jobId: string): Promise<JobPosition[]> {
    return Array.from(this.jobPositions.values()).filter(p => p.jobId === jobId);
  }
  async updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined> {
    const existing = this.jobs.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...job };
    this.jobs.set(id, updated);
    return updated;
  }
  async deleteJob(id: string): Promise<boolean> { return this.jobs.delete(id); }
  async getJobStats() {
    const allJobs = Array.from(this.jobs.values());
    const departments = new Set(allJobs.map(j => j.department)).size;
    const applications = allJobs.reduce((acc, j) => acc + (parseInt(j.positions || "1") || 1), 0);
    return {
      totalJobs: allJobs.length,
      newToday: Math.min(allJobs.length, 3),
      departments,
      applications
    };
  }

  async getRelatedJobs(jobId: string, category?: string, department?: string, limit: number = 4): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .filter(j => j.id !== jobId && (j.jobCategory === category || j.department === department))
      .slice(0, limit);
  }
  async getTrendingJobs(limit: number = 5): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  }
  async getDepartmentCounts(): Promise<Record<string, number>> {
    const map: Record<string, number> = {};
    this.jobs.forEach(job => {
      map[job.department] = (map[job.department] || 0) + 1;
    });
    return map;
  }
  async incrementJobViewCount(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      this.jobs.set(jobId, { ...job, viewCount: (job.viewCount || 0) + 1 });
    }
  }

  async getExam(id: string): Promise<Exam | undefined> { return this.exams.get(id); }
  async getExamBySlug(slug: string): Promise<Exam | undefined> {
    return Array.from(this.exams.values()).find(e => e.slug === slug);
  }
  async createExam(exam: InsertExam): Promise<Exam> {
    const id = randomUUID();
    const e = { ...exam, id, createdAt: new Date() } as Exam;
    this.exams.set(id, e);
    return e;
  }
  async updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined> {
    const existing = this.exams.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...exam };
    this.exams.set(id, updated);
    return updated;
  }
  async deleteExam(id: string): Promise<boolean> { return this.exams.delete(id); }

  async getUrlProcessingLogs(adminId: string): Promise<any[]> { return []; }
  async getExtractionTemplates(): Promise<any[]> { return []; }
  async createUrlProcessingLog(log: any): Promise<any> { return log; }
  
  async getVisitorStats(): Promise<{ totalVisitors: number; uniqueVisitors: number }> {
    return { totalVisitors: 0, uniqueVisitors: 0 };
  }
  async recordVisitor(ipHash: string, isUnique: boolean): Promise<void> {}

  private siteSettings?: SiteSettings;
  async getSiteSettings(): Promise<SiteSettings> {
    if (!this.siteSettings) {
      this.siteSettings = {
        id: "default",
        adsEnabled: false,
        adsHeaderCode: null,
        adsContentCode: null,
        joinWhatsAppUrl: "https://chat.whatsapp.com/Example",
        joinTelegramUrl: "https://t.me/Example",
        joinArattaiUrl: "https://www.arattai.in/Example",
        joinFacebookUrl: "https://www.facebook.com/Example",
        enabledSocialPlatforms: ["whatsapp", "telegram", "facebook", "twitter", "linkedin"],
        aiModelProvider: "gemini",
        geminiApiKey: null,
        groqApiKey: null,
        ollamaEndpoint: "http://localhost:11434",
        ollamaModel: "llama3",
        updatedAt: new Date()
      };
    }
    return this.siteSettings!;
  }
  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    this.siteSettings = { ...current, ...settings, updatedAt: new Date() };
    return this.siteSettings;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }
  async getJobBySlug(slug: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.slug, slug));
    return job || undefined;
  }
  async getAllJobs(limit?: number): Promise<Job[]> {
    const q = db.select().from(jobs).orderBy(desc(jobs.createdAt));
    if (limit) return await q.limit(limit);
    return await q;
  }
  async searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }> {
    const { normalizeFilters, jobMatchesFilters } = await import('@shared/filters');
    let query: any = db.select().from(jobs);
    const conditions = [];
    if (params.search) {
      const terms = params.search.split(/\s+OR\s+/i);
      const searchConditions = terms.map(term => 
        sql`(${jobs.title} ILIKE ${`%${term.trim()}%`} OR ${jobs.department} ILIKE ${`%${term.trim()}%`} OR ${jobs.jobCategory} ILIKE ${`%${term.trim()}%`} OR ${jobs.description} ILIKE ${`%${term.trim()}%`})`
      );
      conditions.push(sql`(${sql.join(searchConditions, sql` OR `)})`);
    }
    if (conditions.length > 0) query = query.where(and(...conditions));
    const allJobs = await query as Job[];
    const normalizedFilters = normalizeFilters(params);
    const filteredJobs = allJobs.filter((job: Job) => jobMatchesFilters(job, normalizedFilters));
    
    // Apply exact sorting based on enum
    let sortedJobs = [...filteredJobs];
    if (params.sortBy === 'deadline') {
      sortedJobs.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (params.sortBy === 'title') {
      sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (params.sortBy === 'department') {
      sortedJobs.sort((a, b) => a.department.localeCompare(b.department));
    } else {
      // latest first (default)
      sortedJobs.sort((a, b) => {
        const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dB - dA;
      });
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    return { jobs: sortedJobs.slice((page - 1) * limit, page * limit), total: sortedJobs.length };
  }
  
  async searchJobsForRAG(query: string): Promise<Job[]> {
    try {
      const searchTerms = query.split(' ').filter(t => t.length > 2);
      if (searchTerms.length === 0) return [];
      const term = `%${searchTerms[0]}%`;
      return await db.select()
        .from(jobs)
        .where(sql`${jobs.title} ILIKE ${term} OR ${jobs.department} ILIKE ${term}`)
        .limit(3);
    } catch (error) {
      console.error("Error in searchJobsForRAG:", error);
      return [];
    }
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }
  async createJobWithPositions(jobData: any): Promise<Job> {
    const { jobPositions: positions, ...rawData } = jobData;
    
    // Sanitize main job data to remove any frontend-only fields like 'useMultiplePositions'
    const mainJobData = insertJobSchema.parse(rawData);
    const job = await this.createJob(mainJobData);
    
    if (positions && positions.length > 0) {
      await db.insert(jobPositions).values(positions.map((p: any) => {
        // Sanitize position data as well
        const { id: _id, ...posData } = p;
        return { ...posData, jobId: job.id };
      }));
    }
    return job;
  }
  async getJobPositions(jobId: string): Promise<JobPosition[]> {
    return await db.select().from(jobPositions).where(eq(jobPositions.jobId, jobId));
  }
  async updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined> {
    const [updated] = await db.update(jobs).set(job).where(eq(jobs.id, id)).returning();
    return updated || undefined;
  }
  async deleteJob(id: string): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async getJobStats() {
    const [total] = await db.select({ count: sql<number>`count(*)` }).from(jobs);
    
    // Calculate new today (server time)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const [newToday] = await db.select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(sql`${jobs.createdAt} >= ${startOfToday}`);
    
    // Count unique departments
    const [depts] = await db.select({ count: sql<number>`count(distinct ${jobs.department})` }).from(jobs);
    
    // Sum vacancies (application estimates)
    const [vacancies] = await db.select({ 
      sum: sql<number>`sum(case when trim(${jobs.positions}) ~ '^[0-9]+$' then trim(${jobs.positions})::integer else 1 end)` 
    }).from(jobs);
    
    return { 
      totalJobs: Number(total.count), 
      newToday: Number(newToday.count), 
      departments: Number(depts.count), 
      applications: Number(vacancies.sum || 0) 
    };
  }
  async getRelatedJobs(jobId: string, category?: string, department?: string, limit: number = 4): Promise<Job[]> {
    const conditions = [sql`${jobs.id} != ${jobId}`];
    if (category || department) {
      const orConditions = [];
      if (category) orConditions.push(eq(jobs.jobCategory, category));
      if (department) orConditions.push(eq(jobs.department, department));
      conditions.push(sql`(${sql.join(orConditions, sql` OR `)})`);
    }
    return await db.select().from(jobs).where(and(...conditions)).limit(limit).orderBy(desc(jobs.createdAt));
  }
  async getTrendingJobs(limit: number = 5): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.viewCount), desc(jobs.createdAt)).limit(limit);
  }
  async getDepartmentCounts(): Promise<Record<string, number>> {
    const counts = await db.select({
      department: jobs.department,
      count: sql<number>`count(*)`,
    }).from(jobs).groupBy(jobs.department);
    const map: Record<string, number> = {};
    counts.forEach(c => { map[c.department] = Number(c.count); });
    return map;
  }
  async incrementJobViewCount(jobId: string): Promise<void> {
    await db.update(jobs).set({ viewCount: sql`${jobs.viewCount} + 1` }).where(eq(jobs.id, jobId));
  }
  async getExam(id: string): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam || undefined;
  }
  async getExamBySlug(slug: string): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.slug, slug));
    return exam || undefined;
  }
  async getAllExams(): Promise<Exam[]> {
    return await db.select().from(exams).orderBy(desc(exams.createdAt));
  }

  async searchExamsForRAG(query: string): Promise<Exam[]> {
    try {
      const searchTerms = query.split(' ').filter(t => t.length > 2);
      if (searchTerms.length === 0) return [];
      const term = `%${searchTerms[0]}%`;
      return await db.select()
        .from(exams)
        .where(sql`${exams.title} ILIKE ${term}`)
        .limit(3);
    } catch (error) {
      console.error("Error in searchExamsForRAG:", error);
      return [];
    }
  }

  async createExam(exam: InsertExam): Promise<Exam> {
    const [newExam] = await db.insert(exams).values(exam).returning();
    return newExam;
  }
  async updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined> {
    const [updated] = await db.update(exams).set(exam).where(eq(exams.id, id)).returning();
    return updated || undefined;
  }
  async deleteExam(id: string): Promise<boolean> {
    const result = await db.delete(exams).where(eq(exams.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async getUrlProcessingLogs(adminId: string): Promise<any[]> {
    return await db.select().from(urlProcessingLogs).where(eq(urlProcessingLogs.adminId, adminId)).orderBy(desc(urlProcessingLogs.createdAt));
  }
  async getExtractionTemplates(): Promise<any[]> {
    return await db.select().from(extractionTemplates).where(eq(extractionTemplates.isActive, true));
  }
  async createUrlProcessingLog(log: any): Promise<any> {
    const [newLog] = await db.insert(urlProcessingLogs).values(log).returning();
    return newLog;
  }

  // Site Analytics Implementation
  async getVisitorStats(): Promise<{ totalVisitors: number; uniqueVisitors: number }> {
    const STATS_ID = "00000000-0000-0000-0000-000000000001";
    try {
      const [stats] = await db.select().from(siteAnalytics).where(eq(siteAnalytics.id, STATS_ID));
      if (!stats) {
        // Initialize if doesn't exist
        const [newStats] = await db.insert(siteAnalytics).values({ 
          id: STATS_ID, 
          totalVisitors: 0, 
          uniqueVisitors: 0 
        }).returning();
        return { totalVisitors: newStats.totalVisitors, uniqueVisitors: newStats.uniqueVisitors };
      }
      return { totalVisitors: stats.totalVisitors, uniqueVisitors: stats.uniqueVisitors };
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      return { totalVisitors: 0, uniqueVisitors: 0 };
    }
  }

  async recordVisitor(ipHash: string, isUnique: boolean): Promise<void> {
    const STATS_ID = "00000000-0000-0000-0000-000000000001";
    try {
      // 1. Log the visit if it's a new combination for this DB
      const result = await db.insert(visitorLogs)
        .values({ ipHash })
        .onConflictDoNothing({ target: visitorLogs.ipHash })
        .returning();
      
      const isNewIpForDB = result.length > 0;

      // 2. Increment counts in site_analytics
      const stats = await this.getVisitorStats();
      
      // Increment unique if middleware said it's a new session OR if it's a new IP/UA we haven't seen in this DB yet
      const incrementUnique = isUnique || isNewIpForDB;

      await db.update(siteAnalytics)
        .set({ 
          totalVisitors: stats.totalVisitors + 1,
          uniqueVisitors: incrementUnique ? stats.uniqueVisitors + 1 : stats.uniqueVisitors,
          updatedAt: new Date()
        })
        .where(eq(siteAnalytics.id, STATS_ID));
    } catch (error) {
      console.error('Error recording visitor:', error);
    }
  }

  // Site Settings Implementation
  async getSiteSettings(): Promise<SiteSettings> {
    const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
    try {
      const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, SETTINGS_ID));
      if (!settings) {
        // Initialize if doesn't exist
        const [newSettings] = await db.insert(siteSettings).values({ 
          id: SETTINGS_ID, 
          adsEnabled: false, 
          adsHeaderCode: "", 
          adsContentCode: "",
          joinWhatsAppUrl: "https://chat.whatsapp.com/Example",
          joinTelegramUrl: "https://t.me/Example",
          joinArattaiUrl: "https://www.arattai.in/Example",
          joinFacebookUrl: "https://www.facebook.com/Example",
          enabledSocialPlatforms: ["whatsapp", "telegram", "facebook", "twitter", "linkedin"]
        }).returning();
        return newSettings;
      }
      return settings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return { 
        id: SETTINGS_ID, 
        adsEnabled: false, 
        adsHeaderCode: "", 
        adsContentCode: "", 
        joinWhatsAppUrl: "https://chat.whatsapp.com/Example",
        joinTelegramUrl: "https://t.me/Example",
        joinArattaiUrl: "https://www.arattai.in/Example",
        joinFacebookUrl: "https://www.facebook.com/Example",
        enabledSocialPlatforms: ["whatsapp", "telegram", "facebook", "twitter", "linkedin"],
        aiModelProvider: "gemini",
        geminiApiKey: null,
        groqApiKey: null,
        ollamaEndpoint: "http://localhost:11434",
        ollamaModel: "llama3",
        updatedAt: new Date() 
      };
    }
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
    // Ensure settings exist first
    await this.getSiteSettings();
    const [updated] = await db.update(siteSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(siteSettings.id, SETTINGS_ID))
      .returning();
    return updated;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

