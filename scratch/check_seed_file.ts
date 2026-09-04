import { readFileSync } from "fs";

const seedFile = readFileSync("server/scripts/seed-adsense-blogs.ts", "utf-8");

// Parse blog entries title and content length from the seed file
const titleRegex = /title:\s*"([^"]+)"/g;
const contentRegex = /content:\s*`([^`]+)`/g;

let titleMatch;
let contentMatch;

const titles: string[] = [];
while ((titleMatch = titleRegex.exec(seedFile)) !== null) {
  titles.push(titleMatch[1]);
}

const contents: string[] = [];
while ((contentMatch = contentRegex.exec(seedFile)) !== null) {
  contents.push(contentMatch[1]);
}

console.log(`Found ${titles.length} titles and ${contents.length} contents in seed file.`);

for (let i = 0; i < Math.max(titles.length, contents.length); i++) {
  const t = titles[i] || "N/A";
  const cLen = contents[i] ? contents[i].length : 0;
  console.log(`${i + 1}. [${cLen} chars] ${t}`);
}
