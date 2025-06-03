import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./dailylogger.module.css";
import SideHeader from "./sideheader";
import logo from "./img/logo.png";

function Dailylogger() {
  const [days, setDays] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const pastWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const formattedDate = day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      pastWeek.unshift({
        date: day,
        formatted: formattedDate,
        status: i === 3 ? "missed" : i === 0 ? "current" : "complete",
      });
    }
    setDays(pastWeek);
    if (pastWeek.length > 0) {
      setMonthLabel(
        pastWeek[pastWeek.length - 1].date.toLocaleDateString("en-US", {
          month: "short",
        })
      );
    }
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEnterClick = () => {
    navigate("/quiz");
  };

  return (
    <div className={styles.dailyLoggerPageWrapper}>
      <aside className={styles.dailyLoggerSidebar}>
        <SideHeader />
      </aside>

      <div className={styles.dailyLoggerMainContent}>
        <header className={styles.dailyLoggerPageHeader}>
          <img src={logo} className={styles.dailyLoggerLogo} alt="logo" />
        </header>

        <div className={styles.dailyLoggerLoggerContent}>
          <div className={styles.dailyLoggerLoggerTitle}>DAILY LOGGER</div>

          <div className={styles.dailyLoggerCalendar}>
            <div className={styles.dailyLoggerMonthLabel}>{monthLabel}</div>
            <div className={styles.dailyLoggerDaysRow}>
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`${styles.dailyLoggerDayBlock} ${styles[`dailyLogger${day.status.charAt(0).toUpperCase() + day.status.slice(1)}`]}`}
                >
                  <div className={styles.dailyLoggerStatusIcon}>
                    {day.status === "complete" && "✔️"}
                    {day.status === "missed" && "❌"}
                    {day.status === "current" && "⏺️"}
                  </div>
                  <div className={styles.dailyLoggerDayNumber}>{day.formatted}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.dailyLoggerEntryBox}>
            <div className={styles.dailyLoggerEntryDate}>{formatDate(new Date())}</div>
            <button
              className={styles.dailyLoggerEntryButton}
              onClick={handleEnterClick}
            >
              ENTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dailylogger;