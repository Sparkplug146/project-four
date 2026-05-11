const authMiddleware = require("./middleware/auth");
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

app.post("/api/questions/:id/answers", authMiddleware, (req, res) => {
  const questionId = req.params.id;
  const { body } = req.body;

  const user_id = req.user.id;

  if (!body) {
    return res.status(400).json({ error: "Answer body required" });
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

app.post("/api/questions", authMiddleware, (req, res) => {
  const { category_id, title, body } = req.body;

  const user_id = req.user.id;

  if (!category_id || !title || !body) {
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

app.delete("/api/questions/:id", authMiddleware, (req, res) => {
  const questionId = req.params.id;
  const userId = req.user.id;

  // First: check if question exists + who owns it
  const checkSql = "SELECT * FROM questions WHERE id = ?";

  db.query(checkSql, [questionId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const question = results[0];

    // Only owner can delete
    if (question.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this question" });
    }

    // Delete answers first (foreign key constraint)
    const deleteAnswersSql = "DELETE FROM answers WHERE question_id = ?";

    db.query(deleteAnswersSql, [questionId], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      // Delete question
      const deleteQuestionSql = "DELETE FROM questions WHERE id = ?";

      db.query(deleteQuestionSql, [questionId], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Question deleted successfully" });
      });
    });
  });
});

app.put("/api/questions/:id", authMiddleware, (req, res) => {
  const questionId = req.params.id;
  const userId = req.user.id;
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: "Title and body required" });
  }

  const checkSql = "SELECT * FROM questions WHERE id = ?";

  db.query(checkSql, [questionId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const question = results[0];

    if (question.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to edit this question" });
    }

    const updateSql = "UPDATE questions SET title = ?, body = ? WHERE id = ?";

    db.query(updateSql, [title, body, questionId], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "Question updated successfully" });
    });
  });
});

app.delete("/api/answers/:id", authMiddleware, (req, res) => {
  const answerId = req.params.id;
  const userId = req.user.id;

  // Check if answer exists + who owns it
  const checkSql = "SELECT * FROM answers WHERE id = ?";

  db.query(checkSql, [answerId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const answer = results[0];

    // Only owner can delete
    if (answer.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this answer" });
    }

    // Delete answer
    const deleteSql = "DELETE FROM answers WHERE id = ?";

    db.query(deleteSql, [answerId], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "Answer deleted successfully" });
    });
  });
});

app.put("/api/answers/:id", authMiddleware, (req, res) => {
  const answerId = req.params.id;
  const userId = req.user.id;
  const { body } = req.body;

  if (!body) {
    return res.status(400).json({ error: "Answer body required" });
  }

  const checkSql = "SELECT * FROM answers WHERE id = ?";

  db.query(checkSql, [answerId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const answer = results[0];

    if (answer.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to edit this answer" });
    }

    const updateSql = "UPDATE answers SET body = ? WHERE id = ?";

    db.query(updateSql, [body, answerId], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "Answer updated successfully" });
    });
  });
});

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