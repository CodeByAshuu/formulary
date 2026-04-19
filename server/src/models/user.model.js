import { pool } from "../config/db.js";

export const findUserByUsername = (username) => {
  return pool.query("SELECT * FROM users WHERE username = $1", [username]);
};
