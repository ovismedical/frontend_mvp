import { useState, useEffect} from "react";
import SideHeader from "./sideheader";
import styles from "./personal_info.module.css"
import logo from "./img/logo.png"

function PersonalInfo({hideHeader = false}) {
  const [patient, setPatient] = useState({
    name: "",
    id: "",
    hospital: "",
    doctor: "",
    medications: []
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);
        const response = await fetch("http://127.0.0.1:8000/personalinfo?username=" + token.name, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        console.log("Fetched:", data);
        setPatient(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPatient();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pageBody}>
        <aside className={styles.sidebar}>
          <SideHeader/>
        </aside>

        <div className={styles.mainArea}>
          <header className={styles.header}>
            <img src={logo} className = {styles.logo}/>
          </header>

          <main className={styles.mainContent}>
            <div className={styles.profileSection}>
              <div className={styles.profilePic}></div>
              <div className={styles.profileName}>{patient.name}</div>
            </div>

            <div className={styles.contentRow}>
              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <label>Patient ID:</label>
                  <div className={styles.infoBox}>{patient.id}</div>
                </div>
                <div className={styles.infoRow}>
                  <label>Hospital/Clinic:</label>
                  <div className={styles.infoBox}>{patient.hospital}</div>
                </div>
                <div className={styles.infoRow}>
                  <label>Doctor/Nurse:</label>
                  <div className={styles.infoBox}>{patient.doctor}</div>
                </div>
              </div>

              <div className={styles.medicationSection}>
                <div className={styles.medicationHeader}>
                  <div className={styles.medicationTitle}>MEDICATION LIST</div>
                </div>
                <div className={styles.medicationList}>
                  {patient.medications.map((med, index) => (
                    <div key={index} className={styles.medicationItem}>
                      {index + 1} | {med.name} | {med.dosage}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo