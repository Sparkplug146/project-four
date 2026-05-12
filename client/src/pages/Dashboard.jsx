import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Dashboard.css";

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

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
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
                className={`category-item ${
                  selectedCategory?.id === cat.id ? "category-selected" : ""
                }`}
              >
                {cat.name}
              </p>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {!selectedCategory ? (
            <h2>Select a Category to view its questions</h2>
          ) : (
            <>
              <Link to="/ask">
                <button className="ask-btn">+ Ask a Question</button>
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
                  <div key={q.id} className="question-card">
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