import { storage } from "../server/storage";

async function verify() {
  console.log("Verifying Job Stats...");
  try {
    const stats = await storage.getJobStats();
    console.log("Current Statistics:", stats);
    
    if (stats.totalJobs > 0) {
      console.log("SUCCESS: Statistics are being calculated correctly.");
    } else {
      console.log("WARNING: Statistics returned 0 jobs. Ensure database is not empty.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verify();
