import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./quiz.module.css";
import SideHeader from "./sideheader";
import logo from "./img/logo.png"

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [otherInput, setOtherInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/questions");
        const data = await response.json();
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(null));
        setProgress((1 / data.questions.length) * 100);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleChoiceClick = (choice) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = choice;
    setAnswers(updatedAnswers);
    if (choice !== "Other") {
      setOtherInput("");
    }
  };

  const handleOtherInputChange = (e) => {
    setOtherInput(e.target.value);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNextClick = () => {
    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      setProgress(((next + 1) / questions.length) * 100);
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestion > 0) {
      const prev = currentQuestion - 1;
      setCurrentQuestion(prev);
      setProgress(((prev + 1) / questions.length) * 100);
    }
  };

  const handleSubmit = () => {
    if (answers.includes(null) || answers.includes("")) {
      alert("Please answer all questions before submitting.");
      return;
    }
    alert("Quiz submitted! Your answers:\n" + JSON.stringify(answers, null, 2));
    navigate("/dashboard");
  };

  return (
    <div className={styles.pageWrapper}>
      <aside className={styles.sidebar}>
        <SideHeader/>
      </aside>

      <div className={styles.fullPage}>
        <header className={styles.pageHeader}>
          <img src={logo} className={styles.logo} alt="logo" />
        </header>

        <div className={styles.quizContainer}>
          {questions.length === 0 ? (
            <p>Loading questions...</p>
          ) : (
            <>
              <div className={styles.questionNumber}>
                QUESTION {currentQuestion + 1}/{questions.length}
              </div>

              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className={styles.progressLabel}>{progress.toFixed(0)}%</div>
              </div>

              <div className={styles.questionBox}>
                {questions[currentQuestion].question}
              </div>

              <div className={styles.choicesRow}>
                {questions[currentQuestion].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceClick(choice)}
                    className={`${styles.choiceButton} ${
                      answers[currentQuestion] === choice ? styles.selected : ""
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {answers[currentQuestion] === "Other" && (
                <input
                  type="text"
                  className={styles.otherInput}
                  placeholder="Enter your answer"
                  value={otherInput}
                  onChange={handleOtherInputChange}
                />
              )}

              <div className={styles.navigationButtons}>
                <button
                  onClick={handlePreviousClick}
                  className={styles.navButton}
                  disabled={currentQuestion === 0}
                >
                  PREVIOUS
                </button>
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className={styles.submitButton}
                  >
                    SUBMIT
                  </button>
                ) : (
                  <button
                    onClick={handleNextClick}
                    className={styles.nextButton}
                  >
                    NEXT
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
