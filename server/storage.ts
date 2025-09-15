import { type User, type InsertUser, type Job, type InsertJob, type SearchJobsParams, jobs, users } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, gte, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Job-related methods
  getJob(id: string): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  getJobStats(): Promise<{
    totalJobs: number;
    newToday: number;
    departments: number;
    applications: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.seedJobs();
  }

  private seedJobs() {
    const today = new Date();
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };
    
    // Generate dates for active jobs
    const postedDates = [
      new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    ];
    
    const deadlineDates = [
      new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      new Date(today.getTime() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
      new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    ];

    const sampleJobs: InsertJob[] = [
      {
        title: "Assistant Section Officer - Ministry of External Affairs",
        department: "Ministry of External Affairs",
        location: "New Delhi",
        qualification: "Graduate in any discipline",
        deadline: formatDate(deadlineDates[0]),
        applyLink: "https://mea.gov.in/careers",
        postedOn: formatDate(postedDates[0]),
        sourceUrl: "https://mea.gov.in",
        positions: 245,
        salary: "₹44,900 - ₹1,42,400 per month",
        ageLimit: "21-30 years",
        applicationFee: "General/OBC: ₹100, SC/ST/PWD: Nil",
        description: "The Assistant Section Officer will be responsible for handling administrative work in the Ministry of External Affairs. Key responsibilities include managing correspondence and documentation, coordinating with various departments, preparing reports and maintaining records, and assisting senior officers in policy implementation.",
        selectionProcess: "Written Examination (Tier-I), Descriptive Paper (Tier-II), Document Verification"
      },
      {
        title: "Junior Engineer - Indian Railways",
        department: "Indian Railways",
        location: "Multiple Locations",
        qualification: "Diploma/B.E. in relevant engineering discipline",
        deadline: formatDate(deadlineDates[1]),
        applyLink: "https://rrbcdg.gov.in",
        postedOn: formatDate(postedDates[1]),
        sourceUrl: "https://rrbcdg.gov.in",
        positions: 1450,
        salary: "₹35,400 - ₹1,12,400 per month",
        ageLimit: "18-33 years",
        applicationFee: "General/OBC: ₹500, SC/ST/PWD: ₹250",
        description: "Junior Engineers in Indian Railways are responsible for maintenance and operation of railway systems including signals, telecommunications, electrical systems, and mechanical equipment.",
        selectionProcess: "Computer Based Test (CBT), Document Verification, Medical Examination"
      },
      {
        title: "Probationary Officer - State Bank of India",
        department: "Banking",
        location: "Pan India",
        qualification: "Graduate in any discipline",
        deadline: formatDate(deadlineDates[2]),
        applyLink: "https://sbi.co.in/careers",
        postedOn: formatDate(postedDates[2]),
        sourceUrl: "https://sbi.co.in",
        positions: 2000,
        salary: "₹27,620 - ₹920,000 per month",
        ageLimit: "21-30 years",
        applicationFee: "General/OBC: ₹750, SC/ST/PWD: ₹125",
        description: "Probationary Officers in SBI handle various banking operations including customer service, loan processing, account management, and branch operations.",
        selectionProcess: "Preliminary Exam, Main Exam, Group Exercise & Interview"
      },
      {
        title: "Sub Inspector - Central Reserve Police Force",
        department: "Police/Security",
        location: "Multiple States",
        qualification: "12th Pass from recognized board",
        deadline: formatDate(deadlineDates[3]),
        applyLink: "https://crpf.gov.in/recruitment",
        postedOn: formatDate(postedDates[3]),
        sourceUrl: "https://crpf.gov.in",
        positions: 425,
        salary: "₹29,200 - ₹92,300 per month",
        ageLimit: "20-25 years",
        applicationFee: "General/OBC: ₹100, SC/ST: Nil",
        description: "Sub Inspectors in CRPF are responsible for maintaining law and order, counter-insurgency operations, and internal security duties.",
        selectionProcess: "Written Exam, Physical Standard Test, Physical Efficiency Test, Medical Exam"
      }
    ];

    sampleJobs.forEach(job => {
      const id = randomUUID();
      const jobWithId: Job = {
        ...job,
        id,
        positions: job.positions ?? null,
        salary: job.salary ?? null,
        ageLimit: job.ageLimit ?? null,
        applicationFee: job.applicationFee ?? null,
        description: job.description ?? null,
        selectionProcess: job.selectionProcess ?? null,
        createdAt: new Date(),
      };
      this.jobs.set(id, jobWithId);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }> {
    let jobs = Array.from(this.jobs.values());

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.department.toLowerCase().includes(searchTerm) ||
        job.qualification.toLowerCase().includes(searchTerm)
      );
    }

    // Use new intelligent filtering system
    const { normalizeFilters, jobMatchesFilters } = await import('@shared/filters');
    const normalizedFilters = normalizeFilters(params);
    
    jobs = jobs.filter(job => jobMatchesFilters(job, normalizedFilters));

    // Apply date filter
    if (params.postedDate) {
      const now = new Date();
      jobs = jobs.filter(job => {
        const postedDate = new Date(job.createdAt!);
        switch (params.postedDate) {
          case 'today':
            return postedDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return postedDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return postedDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (params.sortBy) {
      case 'deadline':
        jobs.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'title':
        jobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'department':
        jobs.sort((a, b) => a.department.localeCompare(b.department));
        break;
      default: // 'latest'
        jobs.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }

    const total = jobs.length;
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    jobs = jobs.slice(startIndex, startIndex + limit);

    return { jobs, total };
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      ...insertJob,
      id,
      positions: insertJob.positions ?? null,
      salary: insertJob.salary ?? null,
      ageLimit: insertJob.ageLimit ?? null,
      applicationFee: insertJob.applicationFee ?? null,
      description: insertJob.description ?? null,
      selectionProcess: insertJob.selectionProcess ?? null,
      createdAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updateJob: Partial<InsertJob>): Promise<Job | undefined> {
    const existingJob = this.jobs.get(id);
    if (!existingJob) return undefined;

    const updatedJob: Job = { ...existingJob, ...updateJob };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async getJobStats(): Promise<{
    totalJobs: number;
    newToday: number;
    departments: number;
    applications: number;
  }> {
    const jobs = Array.from(this.jobs.values());
    const today = new Date().toDateString();
    
    return {
      totalJobs: jobs.length,
      newToday: jobs.filter(job => 
        new Date(job.createdAt!).toDateString() === today
      ).length,
      departments: new Set(jobs.map(job => job.department)).size,
      applications: Math.floor(jobs.reduce((sum, job) => sum + (job.positions || 1), 0) * 45.7) // Simulated application count
    };
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async searchJobs(params: SearchJobsParams): Promise<{ jobs: Job[]; total: number }> {
    // Use intelligent filtering system instead of SQL LIKE conditions
    const { normalizeFilters, jobMatchesFilters } = await import('@shared/filters');
    
    let query = db.select().from(jobs);
    const conditions = [];
    
    // Apply search filter (still use SQL for performance)
    if (params.search) {
      const searchCondition = sql`(
        ${jobs.title} ILIKE ${`%${params.search}%`} OR 
        ${jobs.department} ILIKE ${`%${params.search}%`} OR 
        ${jobs.qualification} ILIKE ${`%${params.search}%`}
      )`;
      conditions.push(searchCondition);
    }

    // Apply date filter using SQL (for performance)
    if (params.postedDate) {
      const now = new Date();
      let dateThreshold;
      
      switch (params.postedDate) {
        case 'today':
          dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (dateThreshold) {
        conditions.push(gte(jobs.createdAt, dateThreshold));
      }
    }

    // Apply basic SQL conditions (search and date only)  
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (params.sortBy) {
      case 'deadline':
        query = query.orderBy(jobs.deadline);
        break;
      case 'title':
        query = query.orderBy(jobs.title);
        break;
      case 'department':
        query = query.orderBy(jobs.department);
        break;
      default: // 'latest'
        query = query.orderBy(desc(jobs.createdAt));
    }

    // Get all matching jobs (without pagination first)
    const allJobs = await query;
    
    // Apply intelligent JavaScript filtering
    const normalizedFilters = normalizeFilters(params);
    const filteredJobs = allJobs.filter(job => jobMatchesFilters(job, normalizedFilters));
    
    const total = filteredJobs.length;
    
    // Apply pagination to filtered results
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit);
    
    return { jobs: paginatedJobs, total };
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    // Check if job already exists to avoid duplicates
    const existing = await db.select().from(jobs)
      .where(and(
        eq(jobs.title, insertJob.title),
        eq(jobs.department, insertJob.department),
        eq(jobs.sourceUrl, insertJob.sourceUrl)
      ))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async updateJob(id: string, updateJob: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set(updateJob)
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async deleteJob(id: string): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getJobStats(): Promise<{
    totalJobs: number;
    newToday: number;
    departments: number;
    applications: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(jobs);
    const [todayResult] = await db.select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(gte(jobs.createdAt, today));
    
    const [deptResult] = await db.select({ count: sql<number>`count(distinct ${jobs.department})` }).from(jobs);
    
    const [positionsResult] = await db.select({ 
      total: sql<number>`sum(coalesce(${jobs.positions}, 1))` 
    }).from(jobs);

    return {
      totalJobs: totalResult.count,
      newToday: todayResult.count,
      departments: deptResult.count,
      applications: Math.floor((positionsResult.total || 0) * 23.7) // Simulate applications
    };
  }
}

export const storage = new DatabaseStorage();
