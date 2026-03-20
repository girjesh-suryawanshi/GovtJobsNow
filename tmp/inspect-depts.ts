import { db } from "../server/db";
import { jobs } from "../shared/schema";
import { sql } from "drizzle-orm";

async function run() {
  try {
    console.log("Unique Departments:");
    const depts = await db.execute(sql`SELECT DISTINCT department FROM jobs ORDER BY department;`);
    console.log(depts.rows.map(r => r.department));
    
    console.log("\nUnique Job Categories:");
    const cats = await db.execute(sql`SELECT DISTINCT job_category FROM jobs ORDER BY job_category;`);
    console.log(cats.rows.map(r => r.job_category));
  } catch (e) {
    console.error(e);
  }
  process.exit();
}

run();
