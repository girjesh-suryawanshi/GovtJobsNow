import { pool } from "../db";

async function main() {
  try {
    console.log("Adding AI configuration columns to site_settings...");
    await pool.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ai_model_provider text DEFAULT 'gemini'`);
    await pool.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS gemini_api_key text`);
    await pool.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS groq_api_key text`);
    await pool.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ollama_endpoint text DEFAULT 'http://localhost:11434'`);
    await pool.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ollama_model text DEFAULT 'llama3'`);
    console.log("Successfully updated database schema.");
  } catch (error) {
    console.error("Error updating database schema:", error);
  } finally {
    process.exit(0);
  }
}

main();
