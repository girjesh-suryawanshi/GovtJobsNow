import fs from 'fs/promises';
import path from 'path';

async function processDirectory(dir: string) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      let content = await fs.readFile(fullPath, 'utf8');
      const original = content;
      content = content.replace(/GovtJobsNow/g, 'GovtJobNow');
      content = content.replace(/govtjobsnow/g, 'govtjobnow');
      if (content !== original) {
        await fs.writeFile(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

async function run() {
  await processDirectory(path.join(process.cwd(), 'client', 'src'));
  await processDirectory(path.join(process.cwd(), 'server'));
  console.log('Done replacing GovtJobNow');
}

run().catch(console.error);
