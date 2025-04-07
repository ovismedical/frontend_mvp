import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import SideHeader from "./sideheader";
import logo from "./img/logo.png"

function DashboardPage() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await fetch(`http://127.0.0.1:8000/personalinfo?id=${token.name}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    fetchPatient();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div className={styles.pageWrapper}>
      <aside className={styles.sidebar}>
        <SideHeader/>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <img src={logo} className = {styles.logo}/>
        </header>

        <div className={styles.contentGrid}>
          <div className={styles.personalBox}>
            <h2>Personal Data</h2>
            {patient ? (
              <>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>DoB:</strong> {patient.dob}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>System:</strong> {patient.condition}</p>
                <p><em>{patient.notes}</em></p>
              </>
            ) : (
              <p>Loading personal data...</p>
            )}
          </div>

          <div className={styles.loggerBox}>
            <div className={styles.loggerHeader}>
              <div className={styles.loggerTitle}>Daily Logger</div>
              <div className={styles.loggerStatus}>Complete ✅</div>
            </div>

            <div className={styles.loggerContent}>
            <div className={styles.loggerDate}>{today}</div>
            <button className={styles.enterButton} onClick={() => navigate("/quiz")}>Enter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
