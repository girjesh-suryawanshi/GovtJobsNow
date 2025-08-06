import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
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
