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
    JOIN medicines m ON s.substitute_id = m.id
    WHERE s.medicine_id = $1
    `,
    [id]
  );
};

export const getMedicineById = (id) => {
  return pool.query("SELECT * FROM medicines WHERE id = $1", [id]);
};

export const createMedicine = (medicine) => {
  const { name, composition, manufacturer, price } = medicine;
  return pool.query(
    "INSERT INTO medicines (name, composition, manufacturer, price) VALUES ($1, $2, $3, $4) RETURNING *",
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

export const addSubstitute = (medicineId, substituteId) => {
  return pool.query(
    "INSERT INTO substitutes (medicine_id, substitute_id) VALUES ($1, $2), ($2, $1) ON CONFLICT DO NOTHING",
    [medicineId, substituteId]
  );
};
