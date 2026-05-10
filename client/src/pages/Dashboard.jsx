import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  function handleCategoryClick(category) {
    setSelectedCategory(category);

    fetch(`http://localhost:5000/api/categories/${category.id}/questions`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.log(err));
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid black",
          padding: "10px",
          overflowY: "auto"
        }}
      >
        <h3>Categories</h3>

        {categories.map((cat) => (
          <p
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory?.id === cat.id ? "bold" : "normal"
            }}
          >
            {cat.name}
          </p>
        ))}
      </div>

      {/* Main Content */}
      <Link to="/ask">
  <button style={{ padding: "10px 15px", marginBottom: "15px" }}>
    + Ask a Question
  </button>
</Link>
      <div style={{ flex: 1, padding: "20px" }}>
        {!selectedCategory ? (
          <h2>Select a Category to view its questions</h2>
        ) : (
          <>
            <h2>{selectedCategory.name} Questions</h2>

            {questions.length === 0 ? (
              <p>No questions yet.</p>
            ) : (
              questions.map((q) => (
                <div
                  key={q.id}
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                >
                <h3>
                    <Link to={`/questions/${q.id}`}>{q.title}</Link>
                </h3>
                  <p>{q.body}</p>
                  <small>
                    Asked by {q.username} on{" "}
                    {new Date(q.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}