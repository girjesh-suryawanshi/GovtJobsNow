import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  qualification: text("qualification").notNull(),
  deadline: text("deadline").notNull(),
  applyLink: text("apply_link").notNull(),
  postedOn: text("posted_on").notNull(),
  sourceUrl: text("source_url").notNull(),
  positions: integer("positions").default(1),
  salary: text("salary"),
  ageLimit: text("age_limit"),
  applicationFee: text("application_fee"),
  description: text("description"),
  selectionProcess: text("selection_process"),
  // Experience requirements
  experienceRequired: text("experience_required"),
  // New priority fields for enhanced admin entry
  jobCategory: text("job_category"),
  employmentType: text("employment_type"),
  recruitingOrganization: text("recruiting_organization"),
  applicationStartDate: text("application_start_date"),
  vacancyBreakdown: text("vacancy_breakdown"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job Positions table for multiple positions with different requirements
export const jobPositions = pgTable("job_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id, { onDelete: "cascade" }).notNull(),
  positionName: text("position_name").notNull(),
  qualification: text("qualification").notNull(),
  experienceRequired: text("experience_required"),
  salaryRange: text("salary_range"),
  numberOfVacancies: integer("number_of_vacancies").default(1),
  specificRequirements: text("specific_requirements"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertJobPositionSchema = createInsertSchema(jobPositions).omit({
  id: true,
  createdAt: true,
});

// Enhanced job creation schema with positions
export const createJobWithPositionsSchema = z.object({
  // Main job data
  job: insertJobSchema,
  // Optional positions array for multi-position jobs
  positions: z.array(z.object({
    positionName: z.string().min(1, "Position name is required"),
    qualification: z.string().min(1, "Qualification is required"),
    experienceRequired: z.string().optional(),
    salaryRange: z.string().optional(),
    numberOfVacancies: z.number().min(1).default(1),
    specificRequirements: z.string().optional(),
  })).optional(),
});

export const searchJobsSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  qualification: z.string().optional(),
  salaryRange: z.string().optional(),
  postedDate: z.enum(["today", "week", "month"]).optional(),
  sortBy: z.enum(["latest", "deadline", "title", "department"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJobPosition = z.infer<typeof insertJobPositionSchema>;
export type JobPosition = typeof jobPositions.$inferSelect;
export type CreateJobWithPositions = z.infer<typeof createJobWithPositionsSchema>;
export type SearchJobsParams = z.infer<typeof searchJobsSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userRegisterSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserRegister = z.infer<typeof userRegisterSchema>;

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin").notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// URL Processing Log Table
export const urlProcessingLogs = pgTable("url_processing_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => adminUsers.id).notNull(),
  url: text("url").notNull(),
  status: text("status").notNull(), // 'processing', 'completed', 'failed', 'review_required'
  extractedData: json("extracted_data"), // JSON object with extracted job fields
  validatedData: json("validated_data"), // JSON object with admin-validated data
  errorMessage: text("error_message"),
  processingTimeMs: integer("processing_time_ms"),
  jobId: varchar("job_id").references(() => jobs.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UrlProcessingLog = typeof urlProcessingLogs.$inferSelect;

// Extraction Templates Table
export const extractionTemplates = pgTable("extraction_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").notNull(), // e.g., 'sarkariresult.com', 'freejobalert.com'
  selectors: json("selectors").notNull(), // JSON object with CSS selectors for different fields
  patterns: json("patterns"), // RegExp patterns for text extraction
  isActive: boolean("is_active").default(true),
  successRate: integer("success_rate").default(0), // Percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ExtractionTemplate = typeof extractionTemplates.$inferSelect;

// Admin Login Schema
export const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// URL Processing Schema
export const processUrlSchema = z.object({
  url: z.string().url(),
  templateId: z.string().optional(),
  autoPublish: z.boolean().default(false),
});

export type ProcessUrlRequest = z.infer<typeof processUrlSchema>;

// Admin management schemas
export const adminPasswordChangeSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const createAdminUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().default("admin"),
});

export const updateJobSchema = insertJobSchema.partial();

// Exam Calendar & Schedule Schema
export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  conductingOrganization: text("conducting_organization").notNull(),
  examDate: text("exam_date").notNull(),
  registrationStartDate: text("registration_start_date").notNull(),
  registrationEndDate: text("registration_end_date").notNull(),
  applicationFee: text("application_fee"),
  examPattern: text("exam_pattern"),
  eligibility: text("eligibility").notNull(),
  officialWebsite: text("official_website").notNull(),
  resultsDate: text("results_date"),
  admitCardDate: text("admit_card_date"),
  syllabus: text("syllabus"),
  location: text("location"),
  duration: text("duration"),
  totalMarks: integer("total_marks"),
  examMode: text("exam_mode"), // Online/Offline/Both
  languagesAvailable: text("languages_available"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
});

export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;

export type AdminPasswordChange = z.infer<typeof adminPasswordChangeSchema>;
export type CreateAdminUser = z.infer<typeof createAdminUserSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
