import { pgTable, check, varchar, text, integer, timestamp, json, boolean, unique, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const exams = pgTable("exams", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: text().notNull(),
	conductingOrganization: text("conducting_organization").notNull(),
	examDate: text("exam_date").notNull(),
	registrationStartDate: text("registration_start_date").notNull(),
	registrationEndDate: text("registration_end_date").notNull(),
	applicationFee: text("application_fee"),
	examPattern: text("exam_pattern"),
	eligibility: text().notNull(),
	officialWebsite: text("official_website").notNull(),
	resultsDate: text("results_date"),
	admitCardDate: text("admit_card_date"),
	syllabus: text(),
	location: text(),
	duration: text(),
	totalMarks: integer("total_marks"),
	examMode: text("exam_mode"),
	languagesAvailable: text("languages_available"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	check("exams_id_not_null", sql`NOT NULL id`),
	check("exams_title_not_null", sql`NOT NULL title`),
	check("exams_conducting_organization_not_null", sql`NOT NULL conducting_organization`),
	check("exams_exam_date_not_null", sql`NOT NULL exam_date`),
	check("exams_registration_start_date_not_null", sql`NOT NULL registration_start_date`),
	check("exams_registration_end_date_not_null", sql`NOT NULL registration_end_date`),
	check("exams_eligibility_not_null", sql`NOT NULL eligibility`),
	check("exams_official_website_not_null", sql`NOT NULL official_website`),
]);

export const extractionTemplates = pgTable("extraction_templates", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	domain: text().notNull(),
	selectors: json().notNull(),
	patterns: json(),
	isActive: boolean("is_active").default(true),
	successRate: integer("success_rate").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	check("extraction_templates_id_not_null", sql`NOT NULL id`),
	check("extraction_templates_name_not_null", sql`NOT NULL name`),
	check("extraction_templates_domain_not_null", sql`NOT NULL domain`),
	check("extraction_templates_selectors_not_null", sql`NOT NULL selectors`),
]);

export const users = pgTable("users", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	email: text().notNull(),
	phone: text(),
	password: text().notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	check("users_id_not_null", sql`NOT NULL id`),
	check("users_full_name_not_null", sql`NOT NULL full_name`),
	check("users_email_not_null", sql`NOT NULL email`),
	check("users_password_not_null", sql`NOT NULL password`),
]);

export const jobPositions = pgTable("job_positions", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	jobId: varchar("job_id").notNull(),
	positionName: text("position_name").notNull(),
	qualification: text().notNull(),
	experienceRequired: text("experience_required"),
	salaryRange: text("salary_range"),
	numberOfVacancies: integer("number_of_vacancies").default(1),
	specificRequirements: text("specific_requirements"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [jobs.id],
			name: "job_positions_job_id_jobs_id_fk"
		}).onDelete("cascade"),
	check("job_positions_id_not_null", sql`NOT NULL id`),
	check("job_positions_job_id_not_null", sql`NOT NULL job_id`),
	check("job_positions_position_name_not_null", sql`NOT NULL position_name`),
	check("job_positions_qualification_not_null", sql`NOT NULL qualification`),
]);

export const adminUsers = pgTable("admin_users", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	username: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('admin').notNull(),
	isActive: boolean("is_active").default(true),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("admin_users_username_unique").on(table.username),
	unique("admin_users_email_unique").on(table.email),
	check("admin_users_id_not_null", sql`NOT NULL id`),
	check("admin_users_username_not_null", sql`NOT NULL username`),
	check("admin_users_email_not_null", sql`NOT NULL email`),
	check("admin_users_password_not_null", sql`NOT NULL password`),
	check("admin_users_role_not_null", sql`NOT NULL role`),
]);

export const urlProcessingLogs = pgTable("url_processing_logs", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	adminId: varchar("admin_id").notNull(),
	url: text().notNull(),
	status: text().notNull(),
	extractedData: json("extracted_data"),
	validatedData: json("validated_data"),
	errorMessage: text("error_message"),
	processingTimeMs: integer("processing_time_ms"),
	jobId: varchar("job_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.adminId],
			foreignColumns: [adminUsers.id],
			name: "url_processing_logs_admin_id_admin_users_id_fk"
		}),
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [jobs.id],
			name: "url_processing_logs_job_id_jobs_id_fk"
		}),
	check("url_processing_logs_id_not_null", sql`NOT NULL id`),
	check("url_processing_logs_admin_id_not_null", sql`NOT NULL admin_id`),
	check("url_processing_logs_url_not_null", sql`NOT NULL url`),
	check("url_processing_logs_status_not_null", sql`NOT NULL status`),
]);

export const jobs = pgTable("jobs", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: text().notNull(),
	department: text().notNull(),
	location: text().notNull(),
	qualification: text().notNull(),
	deadline: text().notNull(),
	applyLink: text("apply_link").notNull(),
	postedOn: text("posted_on").notNull(),
	sourceUrl: text("source_url").notNull(),
	positions: integer().default(1),
	salary: text(),
	ageLimit: text("age_limit"),
	applicationFee: text("application_fee"),
	description: text(),
	selectionProcess: text("selection_process"),
	experienceRequired: text("experience_required"),
	jobCategory: text("job_category"),
	employmentType: text("employment_type"),
	recruitingOrganization: text("recruiting_organization"),
	applicationStartDate: text("application_start_date"),
	vacancyBreakdown: text("vacancy_breakdown"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	notificationFileUrl: text("notification_file_url"),
}, (table) => [
	check("jobs_id_not_null", sql`NOT NULL id`),
	check("jobs_title_not_null", sql`NOT NULL title`),
	check("jobs_department_not_null", sql`NOT NULL department`),
	check("jobs_location_not_null", sql`NOT NULL location`),
	check("jobs_qualification_not_null", sql`NOT NULL qualification`),
	check("jobs_deadline_not_null", sql`NOT NULL deadline`),
	check("jobs_apply_link_not_null", sql`NOT NULL apply_link`),
	check("jobs_posted_on_not_null", sql`NOT NULL posted_on`),
	check("jobs_source_url_not_null", sql`NOT NULL source_url`),
]);
