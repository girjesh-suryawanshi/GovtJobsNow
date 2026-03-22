import { storage } from "../server/storage";

async function migrate() {
  console.log("Starting social links migration...");

  const NEW_URLS = {
    joinFacebookUrl: "https://www.facebook.com/Dailygovtjobsalert/",
    joinWhatsAppUrl: "https://tinyurl.com/govtjobnow",
    joinTelegramUrl: "https://t.me/governmentjobnow",
    joinArattaiUrl: "https://aratt.ai/@govtjobnow"
  };

  try {
    const updated = await storage.updateSiteSettings(NEW_URLS);
    console.log("Migration successful!");
    console.log("Updated URLs:", {
      Facebook: updated.joinFacebookUrl,
      WhatsApp: updated.joinWhatsAppUrl,
      Telegram: updated.joinTelegramUrl,
      Arattai: updated.joinArattaiUrl
    });
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
