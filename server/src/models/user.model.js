// server/src/models/user.model.js
import { pool } from "../config/db.js";

export const findUserByEmail = (email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

export const findUserByUsername = (username) => {
  return pool.query("SELECT * FROM users WHERE username = $1", [username]);
};

export const findUserById = (id) => {
  return pool.query("SELECT id, first_name, last_name, email, username, created_at FROM users WHERE id = $1", [id]);
};

export const createUser = ({ firstName, lastName, username, email, password }) => {
  return pool.query(
    "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, username",
    [firstName, lastName, username, email, password]
  );
};

export const updateUser = (id, { firstName, lastName }) => {
  return pool.query(
    "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, first_name, last_name, email, role, created_at",
    [firstName, lastName, id]
  );
};
