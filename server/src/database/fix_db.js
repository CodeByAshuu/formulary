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

async function fixDb() {
  try {
    console.log("Deleting duplicate medicines...");
    await pool.query(`
      DELETE FROM medicines
      WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (partition BY name ORDER BY id) as rnum
          FROM medicines
        ) t
        WHERE t.rnum > 1
      )
    `);
    
    console.log("Adding UNIQUE constraint...");
    await pool.query("ALTER TABLE medicines ADD CONSTRAINT unique_medicine_name UNIQUE (name)");
    console.log("Constraint added.");
    
    console.log("Cleaning substitutes for test...");
    await pool.query("DELETE FROM substitutes");
    
    console.log("Done.");
  } catch (err) {
    if (err.code === '42710') {
      console.log("Constraint already exists.");
    } else {
      console.error(err);
    }
  } finally {
    await pool.end();
  }
}
fixDb();
