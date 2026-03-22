import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
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
  experienceRequired: text("experience_required"),
  jobCategory: text("job_category"),
  employmentType: text("employment_type"),
  recruitingOrganization: text("recruiting_organization"),
  applicationStartDate: text("application_start_date"),
  vacancyBreakdown: text("vacancy_breakdown"),
  notificationFileUrl: text("notification_file_url"),
  prepGuide: text("prep_guide"),
  syllabus: text("syllabus"),
  viewCount: integer("view_count").default(0),
  slug: varchar("slug").unique(),
  notifications: json("notifications").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobPositions = pgTable("job_positions", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
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

export const createJobWithPositionsSchema = z.object({
  job: insertJobSchema,
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
  jobCategory: z.string().optional(),
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
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
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

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
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

export const urlProcessingLogs = pgTable("url_processing_logs", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => adminUsers.id).notNull(),
  url: text("url").notNull(),
  status: text("status").notNull(),
  extractedData: json("extracted_data"),
  validatedData: json("validated_data"),
  errorMessage: text("error_message"),
  processingTimeMs: integer("processing_time_ms"),
  jobId: varchar("job_id").references(() => jobs.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UrlProcessingLog = typeof urlProcessingLogs.$inferSelect;

export const extractionTemplates = pgTable("extraction_templates", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  selectors: json("selectors").notNull(),
  patterns: json("patterns"),
  isActive: boolean("is_active").default(true),
  successRate: integer("success_rate").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ExtractionTemplate = typeof extractionTemplates.$inferSelect;

export const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const processUrlSchema = z.object({
  url: z.string().url(),
  templateId: z.string().optional(),
  autoPublish: z.boolean().default(false),
});

export type ProcessUrlRequest = z.infer<typeof processUrlSchema>;

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

export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  conductingOrganization: text("conducting_organization"),
  examDate: text("exam_date").notNull(),
  registrationStartDate: text("registration_start_date").notNull(),
  registrationEndDate: text("registration_end_date").notNull(),
  applicationFee: text("application_fee"),
  eligibility: text("eligibility"),
  ageLimit: text("age_limit"),
  vacancies: text("vacancies"),
  officialWebsite: text("official_website"),
  resultsDate: text("results_date"),
  admitCardDate: text("admit_card_date"),
  syllabus: text("syllabus"),
  examMode: text("exam_mode"),
  examBrief: text("exam_brief"),
  slug: varchar("slug").unique(),
  notifications: json("notifications").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteAnalytics = pgTable("site_analytics", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  totalVisitors: integer("total_visitors").default(0).notNull(),
  uniqueVisitors: integer("unique_visitors").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const visitorLogs = pgTable("visitor_logs", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  ipHash: text("ip_hash").unique().notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  adsEnabled: boolean("ads_enabled").default(false).notNull(),
  adsHeaderCode: text("ads_header_code"),
  adsContentCode: text("ads_content_code"),
  joinWhatsAppUrl: text("join_whatsapp_url").default("https://chat.whatsapp.com/Example"),
  joinTelegramUrl: text("join_telegram_url").default("https://t.me/Example"),
  joinArattaiUrl: text("join_arattai_url").default("https://www.arattai.in/Example"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
});

export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;

export type AdminPasswordChange = z.infer<typeof adminPasswordChangeSchema>;
export type CreateAdminUser = z.infer<typeof createAdminUserSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
