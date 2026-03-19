import "dotenv/config";
import pkg from 'pg';
const { Pool } = pkg;

async function cleanup() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log("Cleaning up analytics tables to resolve migration conflict...");
    
    // Drop the new tables that are causing conflicts
    await pool.query("DROP TABLE IF EXISTS visitor_logs CASCADE;");
    await pool.query("DROP TABLE IF EXISTS site_analytics CASCADE;");
    
    console.log("Cleanup successful. You can now run 'npm run db:push' safely.");
  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

cleanup();
