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

async function checkData() {
  try {
    const medicines = await pool.query("SELECT * FROM medicines LIMIT 5");
    console.log("Medicines:", JSON.stringify(medicines.rows, null, 2));
    
    if (medicines.rows.length === 0) {
      console.log("No medicines found. Seeding basic data...");
      await pool.query("INSERT INTO medicines (name, composition, manufacturer, price) VALUES ('Paracetamol 500mg', 'Paracetamol', 'GSK', 2.50), ('Crocin 500', 'Paracetamol', 'Cipla', 2.00), ('Dolo 650', 'Paracetamol', 'Micro Labs', 3.00)");
      const sub1 = await pool.query("SELECT id FROM medicines WHERE name = 'Paracetamol 500mg'");
      const sub2 = await pool.query("SELECT id FROM medicines WHERE name = 'Crocin 500'");
      const sub3 = await pool.query("SELECT id FROM medicines WHERE name = 'Dolo 650'");
      
      const m1 = sub1.rows[0].id;
      const m2 = sub2.rows[0].id;
      const m3 = sub3.rows[0].id;
      
      await pool.query("INSERT INTO substitutes (medicine_id, substitute_id) VALUES ($1, $2), ($2, $1), ($1, $3), ($3, $1), ($2, $3), ($3, $2)", [m1, m2]);
      console.log("Seeding complete.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
checkData();
