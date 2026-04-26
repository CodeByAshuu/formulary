import { pool } from "../config/db.js";

export const findMedicineByName = (name) => {
  return pool.query(
    "SELECT * FROM medicines WHERE name ILIKE $1 ORDER BY name ASC",
    [`%${name}%`]
  );
};

export const findSubstitutes = (id) => {
  return pool.query(
    `
    SELECT m.*
    FROM substitutes s
    JOIN medicines m ON (
      (s.medicine_id = $1 AND s.substitute_id = m.id) OR 
      (s.substitute_id = $1 AND s.medicine_id = m.id)
    )
    WHERE s.medicine_id = $1 OR s.substitute_id = $1
    `,
    [id]
  );
};

export const getMedicineById = (id) => {
  return pool.query("SELECT * FROM medicines WHERE id = $1", [id]);
};

export const findMedicinesByComposition = (composition, excludeId) => {
  return pool.query(
    "SELECT * FROM medicines WHERE composition = $1 AND id != $2",
    [composition, excludeId]
  );
};

export const createMedicine = (medicine) => {
  const { name, composition, manufacturer, price } = medicine;
  return pool.query(
    "INSERT INTO medicines (name, composition, manufacturer, price) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO UPDATE SET composition = EXCLUDED.composition, manufacturer = EXCLUDED.manufacturer, price = EXCLUDED.price RETURNING *",
    [name, composition, manufacturer, price]
  );
};

export const updateMedicine = (id, medicine) => {
  const { name, composition, manufacturer, price } = medicine;
  return pool.query(
    "UPDATE medicines SET name = $1, composition = $2, manufacturer = $3, price = $4 WHERE id = $5 RETURNING *",
    [name, composition, manufacturer, price, id]
  );
};

export const deleteMedicine = (id) => {
  return pool.query("DELETE FROM medicines WHERE id = $1 RETURNING *", [id]);
};

export const addSubstitute = (id1, id2) => {
  const [minId, maxId] = [Math.min(id1, id2), Math.max(id1, id2)];
  return pool.query(
    "INSERT INTO substitutes (medicine_id, substitute_id) VALUES ($1, $2) ON CONFLICT (medicine_id, substitute_id) DO NOTHING",
    [minId, maxId]
  );
};

export const getAdminMetrics = () => {
  return pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM medicines) AS total_medicines,
      (SELECT COUNT(*) FROM medicines WHERE created_at >= NOW() - INTERVAL '7 days') AS added_this_week,
      (SELECT COUNT(*) FROM medicines m 
       WHERE NOT EXISTS (
         SELECT 1 FROM substitutes s 
         WHERE s.medicine_id = m.id OR s.substitute_id = m.id
       )) AS no_substitutes,
      (SELECT COUNT(*) FROM substitutes) AS total_links
  `);
};

export const getAllMedicines = () => {
  return pool.query(`
    SELECT m.*, 
      (SELECT COUNT(*) FROM substitutes s 
       WHERE s.medicine_id = m.id OR s.substitute_id = m.id) AS substitute_count
    FROM medicines m
    ORDER BY m.created_at DESC
  `);
};

export const removeSubstitute = (id1, id2) => {
  const [minId, maxId] = [Math.min(id1, id2), Math.max(id1, id2)];
  return pool.query(
    "DELETE FROM substitutes WHERE medicine_id = $1 AND substitute_id = $2",
    [minId, maxId]
  );
};
