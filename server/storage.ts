import { type User, type InsertUser, type Job, type InsertJob, type SearchJobsParams, type JobPosition, type InsertJobPosition, type CreateJobWithPositions, type Exam, type InsertExam, jobs, users, jobPositions, exams, urlProcessingLogs, extractionTemplates, siteAnalytics, visitorLogs } from "@shared/schema";
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
  getAllJobs(): Promise<Job[]>;
  searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }>;
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

  // Exam-related methods
  getExam(id: string): Promise<Exam | undefined>;
  getAllExams(): Promise<Exam[]>;
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

  async getJob(id: string): Promise<Job | undefined> { return this.jobs.get(id); }
  async getAllJobs(): Promise<Job[]> { return Array.from(this.jobs.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()); }
  async searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }> { return { jobs: [], total: 0 }; }
  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job = { ...insertJob, id, createdAt: new Date(), positions: insertJob.positions || 1, viewCount: 0 } as Job;
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
  async getJobStats() { return { totalJobs: 0, newToday: 0, departments: 0, applications: 0 }; }
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
  async incrementJobViewCount(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      this.jobs.set(jobId, { ...job, viewCount: (job.viewCount || 0) + 1 });
    }
  }

  async getExam(id: string): Promise<Exam | undefined> { return this.exams.get(id); }
  async getAllExams(): Promise<Exam[]> { return Array.from(this.exams.values()); }
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
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }
  async searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }> {
    const { normalizeFilters, jobMatchesFilters } = await import('@shared/filters');
    let query: any = db.select().from(jobs);
    const conditions = [];
    if (params.search) {
      conditions.push(sql`(${jobs.title} ILIKE ${`%${params.search}%`} OR ${jobs.department} ILIKE ${`%${params.search}%`})`);
    }
    if (conditions.length > 0) query = query.where(and(...conditions));
    const allJobs = await query as Job[];
    const normalizedFilters = normalizeFilters(params);
    const filteredJobs = allJobs.filter((job: Job) => jobMatchesFilters(job, normalizedFilters));
    const page = params.page || 1;
    const limit = params.limit || 10;
    return { jobs: filteredJobs.slice((page - 1) * limit, page * limit), total: filteredJobs.length };
  }
  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }
  async createJobWithPositions(jobData: any): Promise<Job> {
    const { jobPositions: positions, ...mainJobData } = jobData;
    const job = await this.createJob(mainJobData);
    if (positions && positions.length > 0) {
      await db.insert(jobPositions).values(positions.map((p: any) => ({ ...p, jobId: job.id })));
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
    return { totalJobs: Number(total.count), newToday: 0, departments: 0, applications: 0 };
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
  async incrementJobViewCount(jobId: string): Promise<void> {
    await db.update(jobs).set({ viewCount: sql`${jobs.viewCount} + 1` }).where(eq(jobs.id, jobId));
  }
  async getExam(id: string): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam || undefined;
  }
  async getAllExams(): Promise<Exam[]> {
    return await db.select().from(exams).orderBy(desc(exams.createdAt));
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
}

export const storage = new DatabaseStorage();
