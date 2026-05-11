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

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerBody, setEditAnswerBody] = useState("");

  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setEditTitle(data.title);
        setEditBody(data.body);
      })
      .catch((err) => console.log(err));

    fetch(`http://localhost:5000/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => setAnswers(data))
      .catch((err) => console.log(err));
  }, [id]);

  function reloadAnswers() {
    fetch(`http://localhost:5000/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => setAnswers(data));
  }

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

          fetch(`http://localhost:5000/api/questions/${id}`)
            .then((res) => res.json())
            .then((data) => setQuestion(data));
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
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={handleDeleteQuestion}
                  style={{ padding: "10px" }}
                >
                  Delete Question
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{ padding: "10px", marginLeft: "10px" }}
                >
                  Edit Question
                </button>
              </div>
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
          </>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit Question</h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: "100%", padding: "10px", fontSize: "18px" }}
            />

            <br />
            <br />

            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows="6"
              style={{ width: "100%", padding: "10px" }}
            />

            <br />

            <button
              type="submit"
              style={{ padding: "10px", marginTop: "10px" }}
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                padding: "10px",
                marginTop: "10px",
                marginLeft: "10px"
              }}
            >
              Cancel
            </button>
          </form>
        )}

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
              {editingAnswerId === a.id ? (
                <>
                  <textarea
                    value={editAnswerBody}
                    onChange={(e) => setEditAnswerBody(e.target.value)}
                    rows="4"
                    style={{ width: "100%", padding: "10px" }}
                  />

                  <button
                    onClick={() => handleSaveEditAnswer(a.id)}
                    style={{ marginTop: "10px", padding: "6px 10px" }}
                  >
                    Save
                  </button>

                  <button
                    onClick={handleCancelEditAnswer}
                    style={{
                      marginTop: "10px",
                      padding: "6px 10px",
                      marginLeft: "10px"
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{a.body}</p>

                  <small>
                    Answered by {a.username} on{" "}
                    {new Date(a.created_at).toLocaleString()}
                  </small>

                  {user && user.username === a.username && (
                    <div style={{ marginTop: "10px" }}>
                      <button
                        onClick={() => handleDeleteAnswer(a.id)}
                        style={{ padding: "6px 10px" }}
                      >
                        Delete Answer
                      </button>

                      <button
                        onClick={() => handleStartEditAnswer(a)}
                        style={{ padding: "6px 10px", marginLeft: "10px" }}
                      >
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