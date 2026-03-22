import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function cleanup() {
  const client = await pool.connect();
  try {
    console.log("Connected to database. Starting corrected aggressive cleanup...");

    await client.query(`
      DO $$ 
      DECLARE 
          r RECORD;
      BEGIN
          FOR r IN (
            SELECT conname, relname 
            FROM pg_constraint 
            JOIN pg_class ON pg_class.oid = pg_constraint.conrelid 
            JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
            WHERE conname LIKE '%_not_null%'
            AND nspname = 'public'
          ) LOOP
              EXECUTE 'ALTER TABLE public.' || quote_ident(r.relname) || ' DROP CONSTRAINT ' || quote_ident(r.conname) || ';';
          END LOOP;
      END $$;
    `);

    console.log("Corrected aggressive cleanup completed successfully.");
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
