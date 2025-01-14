import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleSignUpButtonClick = () => {
    navigate("/signup");
  };

  const handleLoginButtonClick = () => {
    navigate("/login");
  };

  const handleLogoutButtonClick = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedInUserEmail");
    navigate("/");
  };

  return (
    <div className="container-navbar">
      <h1 className="title-navbar" onClick={() => navigate("/")}>
        <span className="highlight">Q</span>uiz
        <span className="highlight">Q</span>uest
      </h1>
      <div className="container-navbar-buttons">
        <button className="sign-up-button" onClick={handleSignUpButtonClick}>
          Sign Up
        </button>
        {isLoggedIn ? (
          <button className="logout-button" onClick={handleLogoutButtonClick}>
            Logout
          </button>
        ) : (
          <button className="login-button" onClick={handleLoginButtonClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
