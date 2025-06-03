import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./adminDashboard.module.css";

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const doctor = token?.name || "Unknown";

    const fetchPatients = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/admin/patients?doctor=${encodeURIComponent(doctor)}`);
        const data = await res.json();
        setPatients(data.patients);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <h2 className={styles.subtitle}>Patients by Doctor</h2>
      {patients.map((patient) => (
        <div key={patient.username} className={styles.patientBlock}>
          <button
            className={styles.patientLink}
            onClick={() => navigate(`/admin/patient/${patient.username}`)}
          >
            {patient.name} ({patient.username})
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
