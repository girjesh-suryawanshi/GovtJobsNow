import { pool } from "../db.js";

async function main() {
  try {
    await pool.query('ALTER TABLE jobs ADD COLUMN IF NOT EXISTS author_name text;');
    console.log('Successfully added author_name column to jobs table.');
  } catch (error) {
    console.error('Failed to add column:', error);
  } finally {
    process.exit(0);
  }
}

main();
