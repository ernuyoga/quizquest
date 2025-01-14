import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import NavBar from "../../components/navbar/NavBar";

const HomePage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [onQuiz, setOnQuiz] = useState(
    JSON.parse(localStorage.getItem("onQuiz")) || false
  );
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const loggedInUserEmail = JSON.parse(
        localStorage.getItem("loggedInUserEmail")
      );
      const user = users.find((user) => user.email === loggedInUserEmail);
      if (user) {
        setUsername(user.username);
      }
    }
  }, [isLoggedIn]);

  const handleQuizButtonClick = (difficulty) => {
    setOnQuiz(true);
    localStorage.setItem("onQuiz", JSON.stringify(true));
    localStorage.setItem("quizDifficulty", difficulty);

    if (!localStorage.getItem("quizStartTime")) {
      localStorage.setItem("quizStartTime", Date.now());
    }

    const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    const lastAnsweredIndex = userAnswers.length;
    navigate(`/quiz/${lastAnsweredIndex + 1}`);
  };

  return (
    <div className="container-home-page">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="content-home-page">
        <div className="greetings-container">
          {isLoggedIn ? (
            <p className="greetings">Welcome to QuizQuest {username}!</p>
          ) : (
            <p className="greetings">Welcome to QuizQuest Adventurer!</p>
          )}
          <div className="description-quiz">
            <p>
              Test your knowledge, challenge your friends, and prove you're the
              ultimate gaming champion.
            </p>
          </div>
        </div>
        <h3 className="short-message">
          Are you ready to level up your trivia game? Let's begin your
          adventure!
        </h3>
        <div className="difficulty-cards">
          <div className="card" onClick={() => handleQuizButtonClick("easy")}>
            <h2>Easy</h2>
          </div>
          <div className="card" onClick={() => handleQuizButtonClick("medium")}>
            <h2>Medium</h2>
          </div>
          <div className="card" onClick={() => handleQuizButtonClick("hard")}>
            <h2>Hard</h2>
          </div>
        </div>
        <h3>Good Luck!</h3>
      </div>
    </div>
  );
};

export default HomePage;
