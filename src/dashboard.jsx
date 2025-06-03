import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import SideHeader from "./sideheader";
import logo from "./img/logo.png";

function DashboardPage() {
  const [patient, setPatient] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(null);
  const navigate = useNavigate();

  const rewardInterval = 5; // Every 5 days gets a reward

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await fetch(`http://127.0.0.1:8000/personalinfo?username=${token.name}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    const fetchStreak = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await fetch(`http://127.0.0.1:8000/getstreak?username=${token.name}`);
        const data = await response.json();
        setCurrentStreak(data);
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };

    fetchPatient();
    fetchStreak();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const getStreakColor = (count) => {
    if (count >= 10) return "green";
    if (count >= 5) return "orange";
    if (count >= 1) return "red";
    return "gray";
  };

  const getProgressPercent = (count) => {
    const progress = count % rewardInterval;
    return (progress / rewardInterval) * 100;
  };

  const getDaysToNextReward = (count) => {
    const remaining = rewardInterval - (count % rewardInterval);
    return remaining === rewardInterval ? 0 : remaining;
  };

  return (
    <div className={styles.pageWrapper}>
      <aside className={styles.sidebar}>
        <SideHeader />
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <img src={logo} className={styles.logo} alt="Logo" />
        </header>

        <div className={styles.contentGrid}>
          <div className={styles.topGrid}>
            <div className={styles.personalBox}>
              <h2>Personal Data</h2>
              {patient ? (
                <>
                  <p><strong>Name:</strong> {patient.name}</p>
                  <p><strong>DoB:</strong> {patient.dob}</p>
                  <p><strong>Sex:</strong> {patient.sex}</p>
                </>
              ) : (
                <p>Loading personal data...</p>
              )}
            </div>

            <div className={styles.loggerBox}>
              <div className={styles.loggerHeader}>
                <div className={styles.loggerTitle}>Daily Logger</div>
              </div>

              <div className={styles.loggerContent}>
                <div className={styles.loggerDate}>{today}</div>
                <button className={styles.enterButton} onClick={() => navigate("/quiz")}>Begin</button>
              </div>
            </div>
          </div>

          <div className={styles.bottomGrid}>
            <div className={styles.streakBox}>
              <h3 title="Gray = none, Red = low, Orange = medium, Green = high">Current Streak</h3>
              <p
                className={styles.streakCount}
                style={{
                  color: currentStreak !== null ? getStreakColor(currentStreak) : "black"
                }}
              >
                {currentStreak !== null ? `🔥 ${currentStreak} day${currentStreak !== 1 ? "s" : ""}` : "Loading..."}
              </p>

              {currentStreak !== null && (
                <>
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${getProgressPercent(currentStreak)}%`
                      }}
                    ></div>
                  </div>
                  <p className={styles.progressLabel}>
                    {getDaysToNextReward(currentStreak)} day{getDaysToNextReward(currentStreak) !== 1 ? "s" : ""} to next reward
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
