import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizSummaryPage.css";
import NavBar from "../../components/navbar/NavBar";

function QuizSummaryPage({ isLoggedIn, setIsLoggedIn }) {
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();
  const [resultStored, setResultStored] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const storedAnswers =
        JSON.parse(localStorage.getItem("userAnswers")) || [];
      setUserAnswers(storedAnswers);

      const difficulty = localStorage.getItem("quizDifficulty") || "easy";
      setQuizDifficulty(difficulty);

      if (!resultStored) {
        const correctAnswersCount = storedAnswers.filter(
          (answer) => answer.answer === answer.correctAnswer
        ).length;
        const incorrectAnswersCount =
          storedAnswers.length - correctAnswersCount;
        const result = {
          id: new Date().toISOString(),
          date: new Date().toISOString(),
          totalQuestions: storedAnswers.length,
          correctAnswers: correctAnswersCount,
          incorrectAnswers: incorrectAnswersCount,
          difficulty: difficulty,
        };
        const userResults =
          JSON.parse(localStorage.getItem("userResults")) || [];
        const resultExists = userResults.some((res) => res.id === result.id);

        if (!resultExists) {
          userResults.push(result);
          localStorage.setItem("userResults", JSON.stringify(userResults));
          setResultStored(true);
        }
      }
    }
  }, [isLoggedIn, navigate, resultStored]);

  const correctAnswersCount = userAnswers.filter(
    (answer) => answer.answer === answer.correctAnswer
  ).length;
  const incorrectAnswersCount = userAnswers.length - correctAnswersCount;

  const handleGoToHome = () => {
    localStorage.removeItem("userAnswers");
    localStorage.setItem("onQuiz", JSON.stringify(false));
    localStorage.removeItem("quizDifficulty");
    localStorage.removeItem("quizStartTime");
    navigate("/");
  };

  return (
    <div className="container-quiz-summary-page">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <h1 className="title-quiz-summary">Quiz Summary</h1>
      <div className="content-quiz-summary">
        <p className="summary-item">Quiz Difficulty: {quizDifficulty}</p>
        <p className="summary-item">Answered Questions: {userAnswers.length}</p>
        <p className="summary-item">Correct Answers: {correctAnswersCount}</p>
        <p className="summary-item">
          Incorrect Answers: {incorrectAnswersCount}
        </p>
        <button className="button-go-home" onClick={handleGoToHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default QuizSummaryPage;
