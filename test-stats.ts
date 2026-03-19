import "dotenv/config";
import { db } from "./server/db";
import { siteAnalytics, visitorLogs } from "./shared/schema";
import { sql } from "drizzle-orm";

async function checkStats() {
  try {
    console.log("Checking database...");
    const stats = await db.select().from(siteAnalytics);
    console.log("Current Statistics Rows:", stats.length);
    console.log("Stats Data:", stats);
    
    const logs = await db.select({ count: sql`count(*)` }).from(visitorLogs);
    console.log("Total unique IP/UA combinations logged:", logs[0]);
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    process.exit(0);
  }
}

checkStats();
