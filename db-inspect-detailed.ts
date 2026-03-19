import "dotenv/config";
import pkg from 'pg';
const { Pool } = pkg;

async function listConstraints() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const tableNames = ['jobs', 'admin_users', 'users', 'exams', 'site_analytics', 'visitor_logs'];
    
    for (const tableName of tableNames) {
      console.log(`\n--- Constraints for ${tableName} ---`);
      const constraints = await pool.query(`
        SELECT conname, pg_get_constraintdef(oid) as definition
        FROM pg_constraint
        JOIN pg_class ON pg_class.oid = pg_constraint.conrelid
        WHERE pg_class.relname = '${tableName}'
      `);
      console.log(constraints.rows);
    }
    
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

listConstraints();
