-- Drop existing tables if they exist
DROP TABLE IF EXISTS substitutes CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table (for admin use cases)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create Medicines table
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  composition TEXT NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Create Substitutes table (Many-to-Many self-referencing relationship)
-- For example: medicine_id = 1 (Paracetamol) and substitute_id = 2 (Crocin)
CREATE TABLE substitutes (
  id SERIAL PRIMARY KEY,
  medicine_id INT REFERENCES medicines(id) ON DELETE CASCADE,
  substitute_id INT REFERENCES medicines(id) ON DELETE CASCADE,
  UNIQUE(medicine_id, substitute_id)
);

-- Add index on medicine name for faster search
CREATE INDEX idx_medicines_name ON medicines(name);
