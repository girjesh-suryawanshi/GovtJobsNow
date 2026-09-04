import "dotenv/config";
import { db } from "../server/db";
import { blogPosts } from "../shared/schema";

async function check() {
  const posts = await db.select().from(blogPosts);
  console.log("Total posts in DB:", posts.length);
  for (const p of posts) {
    console.log(`ID: ${p.id} | Slug: ${p.slug}`);
    console.log(`Title: ${p.title}`);
    console.log(`Content length: ${p.content ? p.content.length : 0}`);
    console.log(`Excerpt: ${p.excerpt?.substring(0, 50)}`);
    console.log(`-----------------------------------`);
  }
  process.exit(0);
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
