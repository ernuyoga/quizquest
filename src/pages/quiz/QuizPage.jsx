import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuizPage.css";

function QuizPage({ isLoggedIn, setIsLoggedIn }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const { questionNumber } = useParams();
  const currentQuestionIndex = parseInt(questionNumber, 10) - 1;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const startTime = localStorage.getItem("quizStartTime");
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const remainingTime = 60 - elapsedTime;

    if (remainingTime <= 0) {
      handleFinishQuiz();
    } else {
      setTimeLeft(remainingTime);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleFinishQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const fetchData = async () => {
    try {
      const difficulty = localStorage.getItem("quizDifficulty") || "easy";
      const apiUrls = {
        easy: "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple",
        medium:
          "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple",
        hard: "https://opentdb.com/api.php?amount=10&category=15&difficulty=hard&type=multiple",
      };
      const cachedQuestions = localStorage.getItem(
        `quizQuestions_${difficulty}`
      );
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrls[difficulty]);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem(
        `quizQuestions_${difficulty}`,
        JSON.stringify(data.results)
      );
      setQuestions(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    setUserAnswers(storedAnswers);
    const currentAnswer = storedAnswers.find(
      (answer) => answer.question === questions[currentQuestionIndex]?.question
    );
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.answer);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerClick = (answer) => {
    const newUserAnswers = [
      ...userAnswers.filter(
        (ans) => ans.question !== questions[currentQuestionIndex].question
      ),
      {
        question: questions[currentQuestionIndex].question,
        answer: answer,
        correctAnswer: questions[currentQuestionIndex].correct_answer,
      },
    ];
    setUserAnswers(newUserAnswers);
    localStorage.setItem("userAnswers", JSON.stringify(newUserAnswers));
    setSelectedAnswer(answer);

    if (currentQuestionIndex + 1 < questions.length) {
      navigate(`/quiz/${currentQuestionIndex + 2}`);
    } else {
      handleFinishQuiz();
    }
  };

  const handleQuestionJump = (index) => {
    setSelectedAnswer(null);
    navigate(`/quiz/${index + 1}`);
  };

  const handleFinishQuiz = () => {
    localStorage.setItem("onQuiz", JSON.stringify(false));
    navigate("/quiz-summary");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ].sort();

  return (
    <div className="container-quiz-page">
      <h1 className="title-name" onClick={() => navigate("/")}>
        <span className="highlight">Q</span>uiz
        <span className="highlight">Q</span>uest
      </h1>
      <div className="quiz-layout">
        <div className="navigation-panel">
          <h3>Navigation</h3>
          <div className="navigations">
            {questions.map((_, index) => {
              const answered = userAnswers.some(
                (ans) => ans.question === questions[index].question
              );
              return (
                <button
                  key={index}
                  onClick={() => handleQuestionJump(index)}
                  className={`button-navigation ${
                    currentQuestionIndex === index
                      ? "current"
                      : answered
                      ? "answered"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="timer">
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </div>
        </div>
        <div className="content-quiz-page">
          <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
          <div className="answers">
            {answers.map((answer, i) => (
              <button
                key={i}
                onClick={() => handleAnswerClick(answer)}
                className={`answer-button ${
                  selectedAnswer === answer ? "selected" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
