const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevDen API is running...");
});

app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

app.get("/api/categories/:id/questions", (req, res) => {
  const categoryId = req.params.id;

  const sql = `
    SELECT questions.id, questions.title, questions.body, questions.created_at, users.username
    FROM questions
    JOIN users ON questions.user_id = users.id
    WHERE questions.category_id = ?
    ORDER BY questions.created_at DESC
  `;

  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

app.get("/api/questions/:id", (req, res) => {
  const questionId = req.params.id;

  const sql = `
    SELECT questions.id, questions.title, questions.body, questions.created_at,
           users.username, categories.name AS category
    FROM questions
    JOIN users ON questions.user_id = users.id
    JOIN categories ON questions.category_id = categories.id
    WHERE questions.id = ?
  `;

  db.query(sql, [questionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(results[0]);
  });
});

app.post("/api/questions/:id/answers", (req, res) => {
  const questionId = req.params.id;
  const { user_id, body } = req.body;

  if (!user_id || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO answers (question_id, user_id, body)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [questionId, user_id, body], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Answer added successfully" });
  });
});

app.get("/api/questions/:id/answers", (req, res) => {
  const questionId = req.params.id;

  const sql = `
    SELECT answers.id, answers.body, answers.created_at, users.username
    FROM answers
    JOIN users ON answers.user_id = users.id
    WHERE answers.question_id = ?
    ORDER BY answers.created_at ASC
  `;

  db.query(sql, [questionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

app.post("/api/questions", (req, res) => {
  const { user_id, category_id, title, body } = req.body;

  if (!user_id || !category_id || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO questions (user_id, category_id, title, body)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, category_id, title, body], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Question posted successfully" });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const checkSql = "SELECT * FROM users WHERE username = ?";

  db.query(checkSql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSql =
      "INSERT INTO users (username, password_hash) VALUES (?, ?)";

    db.query(insertSql, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "User registered successfully" });
    });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
});