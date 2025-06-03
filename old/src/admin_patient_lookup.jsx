import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./adminDashboard.module.css"; // reuse styles

function AdminPatientLookup() {
  const { username } = useParams();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/admin/answers/${username}`);
        const data = await res.json();
        setAnswers(data.answers);
      } catch (err) {
        console.error("Error fetching patient answers:", err);
      }
    };

    fetchAnswers();
  }, [username]);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Quiz Submissions for {username}</h1>
      {answers.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className={styles.quizList}>
          {answers.map((entry, index) => (
            <li key={index} className={styles.quizItem}>
              <div>
                <strong>Time:</strong>{" "}
                <span className={styles.timestamp}>
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <div><strong>Answers:</strong></div>
              <ul className={styles.answerList}>
                {entry.answers[0].map((ans, i) => (
                  <li key={i} className={styles.answerItem}>– {ans}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPatientLookup;
