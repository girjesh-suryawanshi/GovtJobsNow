import "dotenv/config";
import pkg from 'pg';
const { Pool } = pkg;

async function listTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log("Checking live database structure...");
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables:", tables.rows.map(r => r.table_name));
    
    for (const table of tables.rows) {
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${table.table_name}'
      `);
      console.log(`\nTable ${table.table_name} Columns:`, columns.rows);
      
      const constraints = await pool.query(`
        SELECT conname, contype
        FROM pg_constraint
        JOIN pg_class ON pg_class.oid = pg_constraint.conrelid
        WHERE pg_class.relname = '${table.table_name}'
      `);
      console.log(`Table ${table.table_name} Constraints:`, constraints.rows);
    }
    
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

listTables();
