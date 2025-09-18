-- Migration script to update production database schema
-- Run this on your production PostgreSQL database

-- Check current table structure
\d users;

-- Drop the old users table if it exists with the wrong schema
DROP TABLE IF EXISTS users CASCADE;

-- Create the new users table with correct schema
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on created_at for sorting
CREATE INDEX idx_users_created_at ON users(created_at);

-- Verify the new table structure
\d users;
SELECT 'Migration completed successfully!' as status;