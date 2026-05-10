import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        borderBottom: "1px solid black",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          DevDen Forum
        </Link>
      </h2>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span>{user ? `Welcome, ${user.username}` : ""}</span>

        <button onClick={handleLogout} style={{ padding: "8px 12px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}