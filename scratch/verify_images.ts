import "dotenv/config";
import { db } from "../server/db";
import { blogPosts } from "../shared/schema";

async function verifyImages() {
  const posts = await db.select().from(blogPosts);
  console.log(`Auditing images for ${posts.length} blog posts...`);
  const imageMap = new Map<string, string[]>();
  for (const p of posts) {
    const img = p.coverImage || "NO_IMAGE";
    if (!imageMap.has(img)) imageMap.set(img, []);
    imageMap.get(img)!.push(p.slug);
  }
  console.log(`Total unique cover images used: ${imageMap.size}`);
  imageMap.forEach((slugs, img) => {
    console.log(`\nImage URL: ${img} (${slugs.length} posts)`);
    slugs.forEach(s => console.log(` - ${s}`));
  });
  process.exit(0);
}

verifyImages().catch((e) => {
  console.error(e);
  process.exit(1);
});
