import { db } from "../server/db";
import { jobs } from "../shared/schema";

async function main() {
  const allJobs = await db.select().from(jobs);
  console.log(`Found ${allJobs.length} jobs.`);
  
  if (allJobs.length > 0) {
    const job = allJobs[0];
    console.log('Sample job createdAt:', job.createdAt);
    console.log('Sample job createdAt type:', typeof job.createdAt);
    
    if (job.createdAt) {
      const now = new Date();
      const postedDate = new Date(job.createdAt);
      const diffTime = Math.abs(now.getTime() - postedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('now:', now.toISOString());
      console.log('postedDate Obj:', postedDate.toISOString());
      console.log('diffTime ms:', diffTime);
      console.log('diffDays:', diffDays);
    }
  }
  process.exit();
}
main();
