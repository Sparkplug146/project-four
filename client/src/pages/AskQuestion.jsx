import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function AskQuestion() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        category_id: categoryId,
        title: title,
        body: body
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          navigate("/");
        }
      })
      .catch(() => setMessage("Server error"));
  }

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        <Link to="/">⬅ Back to Dashboard</Link>

        <h1>Ask a Question</h1>

        <form onSubmit={handleSubmit}>
          <label>Category:</label>
          <br />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: "300px", padding: "8px" }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "500px", padding: "8px" }}
          />

          <br />
          <br />

          <label>Question:</label>
          <br />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="6"
            style={{ width: "500px", padding: "8px" }}
          />

          <br />
          <br />

          <button type="submit" style={{ padding: "10px 20px" }}>
            Post Question
          </button>
        </form>

        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </div>
  );
}