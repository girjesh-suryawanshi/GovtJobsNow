import "dotenv/config";
import { db } from "../server/db";
import { blogPosts } from "../shared/schema";
import { eq } from "drizzle-orm";

async function extractLinks() {
  const posts = await db.select().from(blogPosts).where(eq(blogPosts.slug, "government-jobs-2026-latest-govt-jobs-in-india"));
  if (posts.length > 0) {
    const html = posts[0].content;
    const matches = html.match(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi);
    console.log("Found links:");
    matches?.forEach(m => console.log(m));
  }
  process.exit(0);
}

extractLinks().catch((e) => {
  console.error(e);
  process.exit(1);
});
