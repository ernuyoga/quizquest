import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUserEmail", JSON.stringify(email));
      setError("");
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container-login">
      <h1 className="title-name" onClick={() => navigate("/")}>
        <span className="highlight">Q</span>uiz
        <span className="highlight">Q</span>uest
      </h1>
      <div className="box-login">
        <h1 className="title-login">Login</h1>
        <div className="container-fields-login">
          <label className="label-login">
            Email:
            <input
              type="email"
              className="input-login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="container-fields-login">
          <label className="label-login">
            Password:
            <input
              type="password"
              className="input-login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <div className="error-message-login">{error}</div>}
        <button className="button-login" onClick={handleLogin}>
          Login
        </button>
        <div className="container-alternative-sign-up">
          <span>Don't have an account yet?</span>
          <span
            className="alternative-sign-up"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
