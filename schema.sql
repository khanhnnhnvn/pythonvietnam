-- This is the schema for the users table in your MySQL database.
-- You should run this query in your MySQL database to create the table.

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,       -- Firebase UID
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
