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

const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
