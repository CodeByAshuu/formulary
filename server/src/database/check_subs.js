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

async function checkSubstitutes() {
  try {
    const res = await pool.query("SELECT COUNT(*) FROM substitutes");
    console.log("Substitutes count:", res.rows[0].count);
    
    if (parseInt(res.rows[0].count) === 0) {
      console.log("No substitutes found. Seeding...");
      // Link Paracetamol medicines (IDs 1, 2, 3)
      await pool.query("INSERT INTO substitutes (medicine_id, substitute_id) VALUES (1, 2), (2, 1), (1, 3), (3, 1), (2, 3), (3, 2)");
      console.log("Seeding complete.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
checkSubstitutes();
