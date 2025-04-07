import { useState } from "react";
import SideHeader from "./sideheader";

function DataPage() {
  const [patient, setPatient] = useState({
    name: "John Doe",
    id: "123456",
    hospital: "General Hospital",
    doctor: "Dr. Smith",
  });

  const [log, setLog] = useState([
    { date: "Feb 1", status: "✅" },
    { date: "Feb 2", status: "✅" },
    { date: "Feb 3", status: "❌" },
    { date: "Feb 4", status: "✅" },
    { date: "Feb 5", status: "✅" },
    { date: "Feb 6", status: "✅" },
    { date: "Feb 7", status: "✅" },
    { date: "Feb 8", status: "✅" },
    { date: "Feb 9", status: "❌" },
    { date: "Feb 10", status: "✅" },
    { date: "Feb 11", status: "✅" },
    { date: "Feb 12", status: "✅" },
    { date: "Feb 13", status: "✅" },
    { date: "Feb 14", status: "❌" },
    { date: "Feb 15", status: "✅" },
    { date: "Feb 16", status: "✅" },
    { date: "Feb 17", status: "❌" },
    { date: "Feb 18", status: "✅" },
    { date: "Feb 19", status: "✅" },
    { date: "Feb 20", status: "✅" },
    { date: "Feb 21", status: "✅" },
    { date: "Feb 22", status: "✅" },
    { date: "Feb 23", status: "✅" },
    { date: "Feb 24", status: "✅" },
  ]);

  const [alerts, setAlerts] = useState([
    { date: "Feb 17", message: "Missed medication." },
    { date: "Feb 20", message: "Low heart rate detected." },
    { date: "Feb 21", message: "Medication dosage change required." },
  ]);

  return (
    <div className="container">
      {/* Header */}
      <SideHeader />

      {/* Profile & Patient Info */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-icon">👤</div>
          <div className="profile-name">{patient.name}</div>
        </div>

        <div className="patient-info">
          <h2>Patient Information</h2>
          <p><strong>ID:</strong> {patient.id}</p>
          <p><strong>Hospital:</strong> {patient.hospital}</p>
          <p><strong>Doctor:</strong> {patient.doctor}</p>
        </div>
      </div>

      {/* Log Calendar & Alerts */}
      <div className="grid-container">
        {/* Log Section */}
        <div className="log-section">
          <div className="log-header">
            <h2>LOG</h2>
            <span className="search-icon">🔍</span>
          </div>

          <div className="calendar">
            <div className="day-header">Sun</div>
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header">Sat</div>

            {log.map((entry, index) => (
              <div key={index} className="log-entry">{entry.status}</div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="alerts-section">
          <div className="alerts-header">
            <h2>ALERTS</h2>
            <span className="search-icon">🔍</span>
          </div>

          <ul className="alerts-list">
            {alerts.map((alert, index) => (
              <li key={index} className="alert-item">
                <strong>{alert.date}:</strong> {alert.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DataPage