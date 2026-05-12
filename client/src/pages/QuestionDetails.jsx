import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import "../styles/QuestionDetails.css";

export default function QuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [newAnswer, setNewAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerBody, setEditAnswerBody] = useState("");

  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  const [questionError, setQuestionError] = useState("");
  const [answersError, setAnswersError] = useState("");

  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    setLoadingQuestion(true);
    setQuestionError("");

    fetch(`http://localhost:5000/api/questions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setQuestionError(data.error);
          setLoadingQuestion(false);
          return;
        }

        setQuestion(data);
        setEditTitle(data.title);
        setEditBody(data.body);
        setLoadingQuestion(false);
      })
      .catch(() => {
        setQuestionError("Failed to load question.");
        setLoadingQuestion(false);
      });

    setLoadingAnswers(true);
    setAnswersError("");

    fetch(`http://localhost:5000/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
        setLoadingAnswers(false);
      })
      .catch(() => {
        setAnswersError("Failed to load answers.");
        setLoadingAnswers(false);
      });
  }, [id]);

  function reloadAnswers() {
    setLoadingAnswers(true);
    setAnswersError("");

    fetch(`http://localhost:5000/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
        setLoadingAnswers(false);
      })
      .catch(() => {
        setAnswersError("Failed to load answers.");
        setLoadingAnswers(false);
      });
  }

  function handleSubmitAnswer(e) {
    e.preventDefault();
    setMessage("");

    if (!newAnswer.trim()) {
      setMessage("Answer cannot be empty.");
      return;
    }

    fetch(`http://localhost:5000/api/questions/${id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        body: newAnswer
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          setNewAnswer("");
          reloadAnswers();
        }
      })
      .catch(() => setMessage("Server error"));
  }

  function handleDeleteQuestion() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/questions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  function handleEditSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!editTitle.trim() || !editBody.trim()) {
      setMessage("Title and body cannot be empty.");
      return;
    }

    fetch(`http://localhost:5000/api/questions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: editTitle,
        body: editBody
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          setIsEditing(false);

          setLoadingQuestion(true);

          fetch(`http://localhost:5000/api/questions/${id}`)
            .then((res) => res.json())
            .then((data) => {
              setQuestion(data);
              setLoadingQuestion(false);
            });
        }
      })
      .catch(() => setMessage("Server error"));
  }

  function handleDeleteAnswer(answerId) {
    const confirmDelete = window.confirm("Delete this answer?");
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/answers/${answerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          reloadAnswers();
        }
      })
      .catch(() => setMessage("Server error"));
  }

  function handleStartEditAnswer(answer) {
    setEditingAnswerId(answer.id);
    setEditAnswerBody(answer.body);
  }

  function handleCancelEditAnswer() {
    setEditingAnswerId(null);
    setEditAnswerBody("");
  }

  function handleSaveEditAnswer(answerId) {
    setMessage("");

    if (!editAnswerBody.trim()) {
      setMessage("Answer cannot be empty.");
      return;
    }

    fetch(`http://localhost:5000/api/answers/${answerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        body: editAnswerBody
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          setEditingAnswerId(null);
          setEditAnswerBody("");
          reloadAnswers();
        }
      })
      .catch(() => setMessage("Server error"));
  }

  if (loadingQuestion) {
    return (
      <div>
        <Header />
        <h2 style={{ padding: "20px" }}>Loading question...</h2>
      </div>
    );
  }

  if (questionError) {
    return (
      <div>
        <Header />
        <div className="question-details-container">
          <h2 className="error-message">{questionError}</h2>
          <Link to="/">⬅ Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="question-details-container">
        <Link to="/" className="back-link">
          ⬅ Back to Dashboard
        </Link>

        {!isEditing ? (
          <>
            <h1>{question.title}</h1>

            <p>
              <strong>Category:</strong> {question.category}
            </p>

            <p>
              <strong>Asked by:</strong> {question.username} |{" "}
              {new Date(question.created_at).toLocaleString()}
            </p>

            {user && user.username === question.username && (
              <div className="question-actions">
                <button onClick={handleDeleteQuestion}>Delete Question</button>
                <button onClick={() => setIsEditing(true)}>Edit Question</button>
              </div>
            )}

            <div className="question-box">
              <p>{question.body}</p>
            </div>
          </>
        ) : (
          <form className="edit-form" onSubmit={handleEditSubmit}>
            <h2>Edit Question</h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <br />
            <br />

            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows="6"
            />

            <button className="submit-btn" type="submit">
              Save Changes
            </button>

            <button
              className="submit-btn"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}

        <h2 style={{ marginTop: "30px" }}>Answers</h2>

        {loadingAnswers ? (
          <p>Loading answers...</p>
        ) : answersError ? (
          <p className="error-message">{answersError}</p>
        ) : answers.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          answers.map((a) => (
            <div key={a.id} className="answer-card">
              {editingAnswerId === a.id ? (
                <>
                  <textarea
                    value={editAnswerBody}
                    onChange={(e) => setEditAnswerBody(e.target.value)}
                    rows="4"
                    style={{ width: "100%", padding: "10px" }}
                  />

                  <div className="answer-actions">
                    <button onClick={() => handleSaveEditAnswer(a.id)}>
                      Save
                    </button>

                    <button onClick={handleCancelEditAnswer}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>{a.body}</p>

                  <small>
                    Answered by {a.username} on{" "}
                    {new Date(a.created_at).toLocaleString()}
                  </small>

                  {user && user.username === a.username && (
                    <div className="answer-actions">
                      <button onClick={() => handleDeleteAnswer(a.id)}>
                        Delete Answer
                      </button>

                      <button onClick={() => handleStartEditAnswer(a)}>
                        Edit Answer
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}

        <h2 style={{ marginTop: "30px" }}>Add Answer</h2>

        <form className="add-answer" onSubmit={handleSubmitAnswer}>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            rows="5"
            placeholder="Write your answer here..."
          />

          <button className="submit-btn" type="submit">
            Submit Answer
          </button>
        </form>

        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}