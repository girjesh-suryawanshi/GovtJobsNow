import "dotenv/config";
import { db } from "../server/db";
import { blogPosts } from "../shared/schema";

async function verifyLinks() {
  const posts = await db.select().from(blogPosts);
  console.log(`Auditing ${posts.length} blog posts for internal links...`);
  let totalLinks = 0;
  for (const p of posts) {
    const matches = p.content?.match(/<a\s+[^>]*href=["']([^"']+)["']/gi);
    const count = matches ? matches.length : 0;
    totalLinks += count;
    console.log(`- [${count} links] ${p.slug}`);
  }
  console.log(`Total internal links found across all posts: ${totalLinks}`);
  process.exit(0);
}

verifyLinks().catch((e) => {
  console.error(e);
  process.exit(1);
});
