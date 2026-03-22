import { storage } from "../server/storage";

async function run() {
  console.log("Fixing social platform casing in database...");
  try {
    const settings = await storage.getSiteSettings();
    if (settings.enabledSocialPlatforms && Array.isArray(settings.enabledSocialPlatforms)) {
      const lowercased = settings.enabledSocialPlatforms.map((p: any) => 
        typeof p === 'string' ? p.toLowerCase() : p
      );
      
      await storage.updateSiteSettings({
        enabledSocialPlatforms: lowercased
      });
      
      console.log("Casing fix successful!");
      console.log("New platforms list:", lowercased);
    } else {
      console.log("No social platforms found to fix.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Casing fix failed:", error);
    process.exit(1);
  }
}

run();
