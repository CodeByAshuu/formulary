import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  try {
    // Add created_at column to medicines
    await pool.query(`
      ALTER TABLE medicines 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log("✓ Added created_at column to medicines table.");

    // Update existing rows to have a created_at value
    await pool.query(`
      UPDATE medicines SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL
    `);
    console.log("✓ Backfilled created_at for existing records.");

    // Add composition index for smart linking performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_medicines_composition ON medicines(composition)
    `);
    console.log("✓ Added composition index.");

    console.log("\nMigration complete.");
  } catch (err) {
    console.error("Migration error:", err.message);
  } finally {
    await pool.end();
  }
}

migrate();
