// server/src/models/user.model.js
import { pool } from "../config/db.js";

export const findUserByEmail = (email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

export const findUserByUsername = (username) => {
  return pool.query("SELECT * FROM users WHERE username = $1", [username]);
};

export const createUser = ({ firstName, lastName, username, email, password }) => {
  return pool.query(
    "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, username",
    [firstName, lastName, username, email, password]
  );
};
