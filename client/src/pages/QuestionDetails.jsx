import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function QuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [newAnswer, setNewAnswer] = useState("");
  const [message, setMessage] = useState("");

  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data))
      .catch((err) => console.log(err));

    fetch(`http://localhost:5000/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => setAnswers(data))
      .catch((err) => console.log(err));
  }, [id]);

  function handleSubmitAnswer(e) {
    e.preventDefault();

    setMessage("");

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

          fetch(`http://localhost:5000/api/questions/${id}/answers`)
            .then((res) => res.json())
            .then((data) => setAnswers(data));
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

  if (!question) {
    return (
      <div>
        <Header />
        <h2 style={{ padding: "20px" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        <Link to="/">⬅ Back to Dashboard</Link>

        <h1>{question.title}</h1>

        <p>
          <strong>Category:</strong> {question.category}
        </p>

        <p>
          <strong>Asked by:</strong> {question.username} |{" "}
          {new Date(question.created_at).toLocaleString()}
        </p>

        {user && user.username === question.username && (
          <button
            onClick={handleDeleteQuestion}
            style={{ padding: "10px", marginTop: "10px" }}
          >
            Delete Question
          </button>
        )}

        <div
          style={{
            border: "1px solid black",
            padding: "15px",
            marginTop: "15px"
          }}
        >
          <p>{question.body}</p>
        </div>

        <h2 style={{ marginTop: "30px" }}>Answers</h2>

        {answers.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          answers.map((a) => (
            <div
              key={a.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <p>{a.body}</p>
              <small>
                Answered by {a.username} on{" "}
                {new Date(a.created_at).toLocaleString()}
              </small>
            </div>
          ))
        )}

        <h2 style={{ marginTop: "30px" }}>Add Answer</h2>

        <form onSubmit={handleSubmitAnswer}>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            rows="5"
            style={{ width: "100%", padding: "10px" }}
            placeholder="Write your answer here..."
          />

          <button style={{ marginTop: "10px", padding: "10px" }} type="submit">
            Submit Answer
          </button>
        </form>

        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </div>
  );
}