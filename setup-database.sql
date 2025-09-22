-- GovtJobsNow Database Setup Script
-- Run this script to create database and user for fresh VPS deployment

-- Connect as postgres superuser first
-- psql -U postgres

-- Create database user
CREATE USER govtjobs WITH PASSWORD 'your_secure_password_here';

-- Create database
CREATE DATABASE govtjobnow OWNER govtjobs;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE govtjobnow TO govtjobs;

-- Connect to the new database
\c govtjobnow

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO govtjobs;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO govtjobs;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO govtjobs;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO govtjobs;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO govtjobs;

-- Verify setup
\l
\du

-- Exit
\q