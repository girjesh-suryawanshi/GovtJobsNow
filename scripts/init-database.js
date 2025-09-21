#!/usr/bin/env node

/**
 * Database Initialization Script for VPS Production
 * This script ensures all required database tables are created
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Initializing GovtJobsNow Database...');
console.log('=====================================');

// Set working directory
process.chdir(path.join(__dirname, '..'));

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found');
  console.log('📊 Running database schema push...');

  // First try normal push
  try {
    execSync('npm run db:push', { stdio: 'inherit' });
    console.log('✅ Database schema created successfully!');
  } catch (error) {
    console.log('⚠️ Normal push failed, trying force push...');
    
    // If normal push fails, try force push
    try {
      execSync('npm run db:push -- --force', { stdio: 'inherit' });
      console.log('✅ Database schema created successfully with force push!');
    } catch (forceError) {
      console.error('❌ Database push failed even with force flag:');
      console.error(forceError.message);
      process.exit(1);
    }
  }

  console.log('');
  console.log('🎉 Database initialization completed successfully!');
  console.log('📋 Created tables:');
  console.log('   - jobs (main job listings)');
  console.log('   - admin_users (admin authentication)');
  console.log('   - url_processing_logs (processing history)');
  console.log('   - extraction_templates (extraction patterns)');
  console.log('   - users (future user authentication)');
  console.log('');
  console.log('🔧 Next step: Create your first admin user in the application');

} catch (error) {
  console.error('❌ Database initialization failed:');
  console.error(error.message);
  console.log('');
  console.log('🔍 Troubleshooting:');
  console.log('1. Check DATABASE_URL is correctly set');
  console.log('2. Ensure PostgreSQL is running and accessible');
  console.log('3. Verify network connectivity to database');
  console.log('4. Check database credentials and permissions');
  process.exit(1);
}