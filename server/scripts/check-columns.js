import { pool } from "../db.js";

async function checkColumns() {
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs';
    `);
    console.log("Columns in jobs table:");
    console.log(res.rows.map(r => r.column_name).join(', '));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
checkColumns();
