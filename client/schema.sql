-- ============================
-- DevDen Forum - schema.sql
-- ============================

DROP DATABASE IF EXISTS devden_forum;
CREATE DATABASE devden_forum;
USE devden_forum;

-- ----------------------------
-- USERS TABLE
-- ----------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- CATEGORIES TABLE
-- ----------------------------
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- ----------------------------
-- QUESTIONS TABLE
-- ----------------------------
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ----------------------------
-- ANSWERS TABLE
-- ----------------------------
CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------
-- DEFAULT CATEGORIES
-- ----------------------------
INSERT INTO categories (name) VALUES
("JavaScript"),
("React"),
("Node.js"),
("SQL"),
("HTML/CSS");

-- Done
SHOW TABLES;
SELECT * FROM categories;