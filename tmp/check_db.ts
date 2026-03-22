
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function checkColumns() {
  console.log("Checking columns for 'jobs' table...");
  try {
    const jobsColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
    `);
    console.log("Jobs columns:", jobsColumns.rows);
  } catch (e) {
    console.error("Error checking jobs columns:", e);
  }

  console.log("\nChecking columns for 'exams' table...");
  try {
    const examsColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'exams'
    `);
    console.log("Exams columns:", examsColumns.rows);
  } catch (e) {
    console.error("Error checking exams columns:", e);
  }

  console.log("\nChecking columns for 'site_settings' table...");
  try {
    const settingsColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'site_settings'
    `);
    console.log("Site Settings columns:", settingsColumns.rows);
  } catch (e) {
    console.error("Error checking site_settings columns:", e);
  }

  process.exit(0);
}

checkColumns();
