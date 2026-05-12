import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [categoryError, setCategoryError] = useState("");
  const [questionError, setQuestionError] = useState("");

  // Load saved category from localStorage
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");

    if (savedCategory) {
      setSelectedCategory(JSON.parse(savedCategory));
    }
  }, []);

  // Load categories
  useEffect(() => {
    setLoadingCategories(true);
    setCategoryError("");

    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => {
        setCategoryError("Failed to load categories.");
        setLoadingCategories(false);
      });
  }, []);

  // Load questions when category is selected
  useEffect(() => {
    if (!selectedCategory) return;

    setLoadingQuestions(true);
    setQuestionError("");

    fetch(`http://localhost:5000/api/categories/${selectedCategory.id}/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoadingQuestions(false);
      })
      .catch(() => {
        setQuestionError("Failed to load questions.");
        setLoadingQuestions(false);
      });
  }, [selectedCategory]);

  function handleCategoryClick(category) {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", JSON.stringify(category));
  }

  return (
    <div>
      <Header />

      <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>
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

          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p style={{ color: "red" }}>{categoryError}</p>
          ) : (
            categories.map((cat) => (
              <p
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    selectedCategory?.id === cat.id ? "bold" : "normal"
                }}
              >
                {cat.name}
              </p>
            ))
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px" }}>
          {!selectedCategory ? (
            <h2>Select a Category to view its questions</h2>
          ) : (
            <>
              <Link to="/ask">
                <button style={{ padding: "10px 15px", marginBottom: "15px" }}>
                  + Ask a Question
                </button>
              </Link>

              <h2>{selectedCategory.name} Questions</h2>

              {loadingQuestions ? (
                <p>Loading questions...</p>
              ) : questionError ? (
                <p style={{ color: "red" }}>{questionError}</p>
              ) : questions.length === 0 ? (
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
    </div>
  );
}