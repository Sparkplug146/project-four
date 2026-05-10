import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function validate() {
    let newErrors = {};

    if (!username) newErrors.username = "Username required";
    if (!password) newErrors.password = "Password required";
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
    <div style={{ padding: "20px" }}>
      <h1>DevDen Forum</h1>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
          />
          <span style={{ color: "red" }}>{errors.username}</span>
        </div>

        <br />

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          <span style={{ color: "red" }}>{errors.password}</span>
        </div>

        <br />

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
          />
          <span style={{ color: "red" }}>{errors.confirmPassword}</span>
        </div>

        <br />

        <label style={{ color: errors.agree ? "red" : "black" }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setErrors((prev) => ({ ...prev, agree: "" }));
            }}
          />{" "}
          I agree to the terms
        </label>

        <br />
        <br />

        <button type="submit">Register</button>
      </form>

      {errors.server && <p style={{ color: "red" }}>{errors.server}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}