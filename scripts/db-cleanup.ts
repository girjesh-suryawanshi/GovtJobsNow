import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function cleanup() {
  const client = await pool.connect();
  try {
    console.log("Connected to database. Starting cleanup...");

    const tables = [
      'jobs', 'exams', 'users', 'admin_users', 'job_positions', 
      'url_processing_logs', 'extraction_templates', 'site_analytics', 
      'visitor_logs', 'site_settings'
    ];

    for (const table of tables) {
      // Find all check constraints for this table
      const res = await client.query(`
        SELECT conname 
        FROM pg_constraint 
        JOIN pg_class ON pg_class.oid = pg_constraint.conrelid 
        WHERE relname = $1 AND contype = 'c';
      `, [table]);

      for (const row of res.rows) {
        const constraintName = row.conname;
        if (constraintName.includes('_not_null')) {
          console.log(`Dropping constraint ${constraintName} from ${table}...`);
          await client.query(`ALTER TABLE "${table}" DROP CONSTRAINT "${constraintName}";`);
        }
      }
    }

    console.log("Cleanup completed successfully.");
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
