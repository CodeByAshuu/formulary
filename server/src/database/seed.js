import fs from 'fs';
import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schemaSql);
    console.log('Schema executed successfully.');

    // Seed admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      ['admin', adminPassword]
    );
    console.log('Admin user seeded (admin, admin123).');

    // Seed medicines
    const medicines = [
      { name: 'Paracetamol 500mg', comp: 'Paracetamol', mfg: 'ABC Pharma', price: 20.5 },
      { name: 'Crocin 500mg', comp: 'Paracetamol', mfg: 'GSK', price: 25.0 },
      { name: 'Dolo 500', comp: 'Paracetamol', mfg: 'Micro Labs', price: 30.0 },
      { name: 'Aspirin 75mg', comp: 'Aspirin', mfg: 'Bayer', price: 15.0 },
      { name: 'Disprin 75mg', comp: 'Aspirin', mfg: 'Reckitt', price: 12.0 },
    ];

    for (const med of medicines) {
      await pool.query(
        'INSERT INTO medicines (name, composition, manufacturer, price) VALUES ($1, $2, $3, $4)',
        [med.name, med.comp, med.mfg, med.price]
      );
    }
    console.log('Medicines seeded.');

    // Paracetamol substitutes (1, 2, 3 are Paracetamol family)
    await pool.query('INSERT INTO substitutes (medicine_id, substitute_id) VALUES (1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)');
    // Aspirin substitutes (4, 5 are Aspirin family)
    await pool.query('INSERT INTO substitutes (medicine_id, substitute_id) VALUES (4, 5), (5, 4)');
    
    console.log('Substitutes seeded.');

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    pool.end();
  }
}

seed();
