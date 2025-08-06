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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
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
export type SearchJobsParams = z.infer<typeof searchJobsSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
