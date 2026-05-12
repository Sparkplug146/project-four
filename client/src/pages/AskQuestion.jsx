import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import "../styles/AskQuestion.css";

export default function AskQuestion() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setError("Failed to load categories."));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!title.trim() || !body.trim()) {
      setError("Title and body cannot be empty.");
      return;
    }

    fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        category_id: categoryId,
        title,
        body
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMessage("Question posted successfully!");
          navigate("/");
        }
      })
      .catch(() => setError("Server error"));
  }

  return (
    <div>
      <Header />

      <div className="ask-container">
        <Link to="/">⬅ Back to Dashboard</Link>

        <h1>Ask a Question</h1>

        <form className="ask-form" onSubmit={handleSubmit}>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Select Category --</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Question Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows="6"
            placeholder="Describe your question..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <button type="submit">Post Question</button>
        </form>

        {error && <p className="ask-error">{error}</p>}
        {message && <p className="ask-success">{message}</p>}
      </div>
    </div>
  );
}