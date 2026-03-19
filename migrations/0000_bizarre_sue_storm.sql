-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "exams" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"conducting_organization" text NOT NULL,
	"exam_date" text NOT NULL,
	"registration_start_date" text NOT NULL,
	"registration_end_date" text NOT NULL,
	"application_fee" text,
	"exam_pattern" text,
	"eligibility" text NOT NULL,
	"official_website" text NOT NULL,
	"results_date" text,
	"admit_card_date" text,
	"syllabus" text,
	"location" text,
	"duration" text,
	"total_marks" integer,
	"exam_mode" text,
	"languages_available" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "exams_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "exams_title_not_null" CHECK (NOT NULL title),
	CONSTRAINT "exams_conducting_organization_not_null" CHECK (NOT NULL conducting_organization),
	CONSTRAINT "exams_exam_date_not_null" CHECK (NOT NULL exam_date),
	CONSTRAINT "exams_registration_start_date_not_null" CHECK (NOT NULL registration_start_date),
	CONSTRAINT "exams_registration_end_date_not_null" CHECK (NOT NULL registration_end_date),
	CONSTRAINT "exams_eligibility_not_null" CHECK (NOT NULL eligibility),
	CONSTRAINT "exams_official_website_not_null" CHECK (NOT NULL official_website)
);
--> statement-breakpoint
CREATE TABLE "extraction_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"selectors" json NOT NULL,
	"patterns" json,
	"is_active" boolean DEFAULT true,
	"success_rate" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "extraction_templates_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "extraction_templates_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "extraction_templates_domain_not_null" CHECK (NOT NULL domain),
	CONSTRAINT "extraction_templates_selectors_not_null" CHECK (NOT NULL selectors)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "users_full_name_not_null" CHECK (NOT NULL full_name),
	CONSTRAINT "users_email_not_null" CHECK (NOT NULL email),
	CONSTRAINT "users_password_not_null" CHECK (NOT NULL password)
);
--> statement-breakpoint
CREATE TABLE "job_positions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"position_name" text NOT NULL,
	"qualification" text NOT NULL,
	"experience_required" text,
	"salary_range" text,
	"number_of_vacancies" integer DEFAULT 1,
	"specific_requirements" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "job_positions_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "job_positions_job_id_not_null" CHECK (NOT NULL job_id),
	CONSTRAINT "job_positions_position_name_not_null" CHECK (NOT NULL position_name),
	CONSTRAINT "job_positions_qualification_not_null" CHECK (NOT NULL qualification)
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email"),
	CONSTRAINT "admin_users_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "admin_users_username_not_null" CHECK (NOT NULL username),
	CONSTRAINT "admin_users_email_not_null" CHECK (NOT NULL email),
	CONSTRAINT "admin_users_password_not_null" CHECK (NOT NULL password),
	CONSTRAINT "admin_users_role_not_null" CHECK (NOT NULL role)
);
--> statement-breakpoint
CREATE TABLE "url_processing_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" varchar NOT NULL,
	"url" text NOT NULL,
	"status" text NOT NULL,
	"extracted_data" json,
	"validated_data" json,
	"error_message" text,
	"processing_time_ms" integer,
	"job_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "url_processing_logs_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "url_processing_logs_admin_id_not_null" CHECK (NOT NULL admin_id),
	CONSTRAINT "url_processing_logs_url_not_null" CHECK (NOT NULL url),
	CONSTRAINT "url_processing_logs_status_not_null" CHECK (NOT NULL status)
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"department" text NOT NULL,
	"location" text NOT NULL,
	"qualification" text NOT NULL,
	"deadline" text NOT NULL,
	"apply_link" text NOT NULL,
	"posted_on" text NOT NULL,
	"source_url" text NOT NULL,
	"positions" integer DEFAULT 1,
	"salary" text,
	"age_limit" text,
	"application_fee" text,
	"description" text,
	"selection_process" text,
	"experience_required" text,
	"job_category" text,
	"employment_type" text,
	"recruiting_organization" text,
	"application_start_date" text,
	"vacancy_breakdown" text,
	"created_at" timestamp DEFAULT now(),
	"notification_file_url" text,
	CONSTRAINT "jobs_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "jobs_title_not_null" CHECK (NOT NULL title),
	CONSTRAINT "jobs_department_not_null" CHECK (NOT NULL department),
	CONSTRAINT "jobs_location_not_null" CHECK (NOT NULL location),
	CONSTRAINT "jobs_qualification_not_null" CHECK (NOT NULL qualification),
	CONSTRAINT "jobs_deadline_not_null" CHECK (NOT NULL deadline),
	CONSTRAINT "jobs_apply_link_not_null" CHECK (NOT NULL apply_link),
	CONSTRAINT "jobs_posted_on_not_null" CHECK (NOT NULL posted_on),
	CONSTRAINT "jobs_source_url_not_null" CHECK (NOT NULL source_url)
);
--> statement-breakpoint
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_processing_logs" ADD CONSTRAINT "url_processing_logs_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_processing_logs" ADD CONSTRAINT "url_processing_logs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
*/