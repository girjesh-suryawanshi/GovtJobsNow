-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    qualification TEXT NOT NULL,
    deadline TEXT NOT NULL,
    apply_link TEXT NOT NULL,
    posted_on TEXT NOT NULL,
    source_url TEXT NOT NULL,
    positions INTEGER DEFAULT 1,
    salary TEXT,
    age_limit TEXT,
    application_fee TEXT,
    description TEXT,
    selection_process TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- URL Processing Logs table
CREATE TABLE IF NOT EXISTS url_processing_logs (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id VARCHAR NOT NULL REFERENCES admin_users(id),
    url TEXT NOT NULL,
    status TEXT NOT NULL,
    extracted_data JSONB,
    validated_data JSONB,
    error_message TEXT,
    processing_time_ms INTEGER,
    job_id VARCHAR REFERENCES jobs(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Extraction Templates table
CREATE TABLE IF NOT EXISTS extraction_templates (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    selectors JSONB NOT NULL,
    patterns JSONB,
    is_active BOOLEAN DEFAULT true,
    success_rate INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
