import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Adding join_facebook_url column to site_settings...");
  try {
    // 1. Check if column exists
    const checkRes = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'site_settings' AND column_name = 'join_facebook_url'
    `);
    
    if (checkRes.rows.length === 0) {
      // 2. Add column
      await db.execute(sql`
        ALTER TABLE site_settings 
        ADD COLUMN join_facebook_url TEXT DEFAULT 'https://www.facebook.com/Example'
      `);
      console.log("Column added successfully.");
    } else {
      console.log("Column already exists.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Failed to add column:", error);
    process.exit(1);
  }
}

run();
