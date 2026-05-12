import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  function validate() {
    let newErrors = {};

    if (!username.trim()) newErrors.username = "Username required";
    if (!password.trim()) newErrors.password = "Password required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agree) newErrors.agree = "You must agree";

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrors({ username: data.error });
        } else {
          navigate("/login");
        }
      })
      .catch(() => setErrors({ server: "Server error" }));
  }

  return (
    <div className="auth-container">
      <div className="auth-title">
        <h1>DevDen Forum</h1>
        <h2>Register</h2>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
          />
          {errors.username && <p className="auth-error">{errors.username}</p>}
        </div>

        <div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          {errors.password && <p className="auth-error">{errors.password}</p>}
        </div>

        <div>
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
          />
          {errors.confirmPassword && (
            <p className="auth-error">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="auth-checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setErrors((prev) => ({ ...prev, agree: "" }));
            }}
          />
          <label>I agree to the terms</label>
        </div>

        {errors.agree && <p className="auth-error">{errors.agree}</p>}

        <button type="submit">Register</button>
      </form>

      {errors.server && <p className="auth-error">{errors.server}</p>}

      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}