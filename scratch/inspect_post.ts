import "dotenv/config";
import { db } from "../server/db";
import { blogPosts } from "../shared/schema";
import { eq } from "drizzle-orm";

async function inspectPost() {
  const posts = await db.select().from(blogPosts).where(eq(blogPosts.slug, "government-jobs-2026-latest-govt-jobs-in-india"));
  if (posts.length > 0) {
    console.log("=== FULL CONTENT START ===");
    console.log(posts[0].content);
    console.log("=== FULL CONTENT END ===");
  }
  process.exit(0);
}

inspectPost().catch((e) => {
  console.error(e);
  process.exit(1);
});
