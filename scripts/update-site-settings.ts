import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Adding social link columns to site_settings table...");
    
    // Add columns if they don't exist
    await client.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS join_whatsapp_url text DEFAULT 'https://chat.whatsapp.com/Example',
      ADD COLUMN IF NOT EXISTS join_telegram_url text DEFAULT 'https://t.me/Example',
      ADD COLUMN IF NOT EXISTS join_arattai_url text DEFAULT 'https://www.arattai.in/Example'
    `);
    
    console.log("Successfully added columns.");
  } catch (err) {
    console.error("Error updating table:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
