import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (!email.includes("@")) {
      setError("Invalid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const newUser = {
      username,
      email,
      password,
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      setError("User with this email already exists");
      return;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setError("");
    navigate("/login");
  };

  return (
    <div className="container-sign-up">
      <h1 className="title-name" onClick={() => navigate("/")}>
        <span className="highlight">Q</span>uiz
        <span className="highlight">Q</span>uest
      </h1>
      <div className="box-sign-up">
        <h1 className="title-sign-up">Sign Up</h1>
        <div className="container-fields-sign-up">
          <label className="label-sign-up">
            Username:
            <input
              type="text"
              className="input-sign-up"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className="container-fields-sign-up">
          <label className="label-sign-up">
            Email:
            <input
              type="email"
              className="input-sign-up"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="container-fields-sign-up">
          <label className="label-sign-up">
            Password:
            <input
              type="password"
              className="input-sign-up"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="container-fields-sign-up">
          <label className="label-sign-up">
            Confirm Password:
            <input
              type="password"
              className="input-sign-up"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <div className="error-message-sign-up">{error}</div>}
        <button className="button-sign-up" onClick={handleSignUp}>
          Sign Up
        </button>
        <div className="container-alternative-login">
          <p>Already have an account?</p>
          <p className="alternative-login" onClick={() => navigate("/login")}>
            Login
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
