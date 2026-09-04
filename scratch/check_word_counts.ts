import "dotenv/config";
import { db } from "../server/db";
import { blogPosts } from "../shared/schema";

async function checkWordCounts() {
  const posts = await db.select().from(blogPosts);
  console.log(`Auditing word count for ${posts.length} blog posts...`);
  let countBelow800 = 0;
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const text = (p.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = text.split(" ").filter(Boolean).length;
    const status = wordCount >= 800 ? "✅ PASS" : "❌ BELOW 800 WORDS";
    if (wordCount < 800) countBelow800++;
    console.log(`${i + 1}. [${wordCount} words] ${status} -> ${p.slug}`);
  }
  console.log(`\nSummary: ${posts.length - countBelow800}/${posts.length} articles meet 800+ word requirement.`);
  process.exit(0);
}

checkWordCounts().catch((e) => {
  console.error(e);
  process.exit(1);
});
