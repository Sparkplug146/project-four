import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="header">
      <Link to="/" className="header-title">
        DevDen Forum
      </Link>

      <div className="header-right">
        {user && <span className="header-user">Logged in as {user.username}</span>}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}