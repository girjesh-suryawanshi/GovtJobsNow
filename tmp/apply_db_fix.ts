
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function applyFix() {
  console.log("Applying database fixes...");
  
  try {
    console.log("Adding 'custom_links' to 'jobs' table...");
    await db.execute(sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS custom_links json DEFAULT '[]'`);
    console.log("Success.");
  } catch (e: any) {
    console.error("Error updating jobs table:", e.message);
  }

  try {
    console.log("Adding 'custom_links' to 'exams' table...");
    await db.execute(sql`ALTER TABLE exams ADD COLUMN IF NOT EXISTS custom_links json DEFAULT '[]'`);
    console.log("Success.");
  } catch (e: any) {
    console.error("Error updating exams table:", e.message);
  }

  try {
    console.log("Adding 'enabled_social_platforms' to 'site_settings' table...");
    // Note: Drizzle might have created it as site_settings, but let's be sure about the name from check_db output
    await db.execute(sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS enabled_social_platforms json DEFAULT '["whatsapp", "telegram", "facebook", "twitter", "linkedin"]'`);
    console.log("Success.");
  } catch (e: any) {
    console.error("Error updating site_settings table:", e.message);
  }

  console.log("Done.");
  process.exit(0);
}

applyFix();
