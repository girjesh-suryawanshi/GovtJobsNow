import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Creating site_settings table...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        ads_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        ads_header_code TEXT,
        ads_content_code TEXT
      );
    `);
    console.log("Table created successfully!");
    
    // Check if it exists
    const result = await db.execute(sql`SELECT * FROM site_settings;`);
    console.log("Current settings count:", result.rows.length);
  } catch (e) {
    console.error("Error creating table:", e);
  }
  process.exit();
}

run();
