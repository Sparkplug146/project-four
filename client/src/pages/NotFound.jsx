import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "60px" }}>404</h1>
      <h2>Page Not Found</h2>

      <p>The page you are looking for does not exist.</p>

      <Link to="/">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}