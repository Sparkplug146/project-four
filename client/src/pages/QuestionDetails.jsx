import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function QuestionDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [newAnswer, setNewAnswer] = useState("");
  const [message, setMessage] = useState("");

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

    fetch(`http://localhost:5000/api/questions/${id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        body: newAnswer
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setNewAnswer("");

        fetch(`http://localhost:5000/api/questions/${id}/answers`)
          .then((res) => res.json())
          .then((data) => setAnswers(data));
      })
      .catch((err) => console.log(err));
  }

  if (!question) {
    return <h2>Loading...</h2>;
  }

  return (
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

      <div
        style={{
          border: "1px solid black",
          padding: "15px",
          marginTop: "10px"
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

      {message && <p>{message}</p>}
    </div>
  );
}