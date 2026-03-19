import "dotenv/config";
import pkg from 'pg';
const { Pool } = pkg;

async function createTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log("Creating analytics tables manually...");
    
    // 1. Create site_analytics
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_analytics (
        id VARCHAR(255) PRIMARY KEY,
        total_visitors INTEGER DEFAULT 0 NOT NULL,
        unique_visitors INTEGER DEFAULT 0 NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
    // 2. Create visitor_logs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id VARCHAR(255) PRIMARY KEY,
        ip_hash TEXT UNIQUE NOT NULL,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
    // 3. Initialize singleton row
    await pool.query(`
      INSERT INTO site_analytics (id, total_visitors, unique_visitors)
      VALUES ('00000000-0000-0000-0000-000000000001', 0, 0)
      ON CONFLICT DO NOTHING;
    `);
    
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Table creation failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createTables();
