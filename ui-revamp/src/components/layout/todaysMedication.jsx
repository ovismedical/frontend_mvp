import React, { useState } from "react";
import "../../styles/components/todaysMedication.css";

const initialMedications = [
  {
    id: 1,
    name: "Doxorubicin",
    dose: "1 vial",
    time: "9:00am",
    stomach: "With Food",
    icon: "pill",
    status: "skipped",
  },
  {
    id: 2,
    name: "Cyclophosphamide",
    dose: "2 pills",
    time: "10:30am",
    stomach: "Empty Stomach",
    icon: "pill",
    status: "taken",
  },
  {
    id: 3,
    name: "Tamoxifen",
    dose: "1 pill",
    time: "8:00am",
    stomach: "With Food",
    icon: "medication_liquid",
    status: "taken",
  },
  {
    id: 4,
    name: "Methotrexate",
    dose: "1 tablet",
    time: "12:00pm",
    stomach: "With Food",
    icon: "pill",
    status: "skipped",
  },
  {
    id: 5,
    name: "Rituximab",
    dose: "1 infusion",
    time: "1:30pm",
    stomach: "Before Meal",
    icon: "medication_liquid",
    status: "skipped",
  },
  {
    id: 6,
    name: "Capecitabine",
    dose: "2 pills",
    time: "6:00pm",
    stomach: "Empty Stomach",
    icon: "pill",
    status: "pending",
  },
  {
    id: 7,
    name: "Anastrozole",
    dose: "1 pill",
    time: "7:30pm",
    stomach: "With Food",
    icon: "pill",
    status: "taken",
  },
];

const MedicationCard = () => {
  const [medications, setMedications] = useState(initialMedications);
  const now = new Date();

  const parseMedTime = (timeStr) => {
    if (!timeStr) return null;
    const [hourMin, suffix] = timeStr.split(/(am|pm)/i);
    const [hour, minute] = hourMin.trim().split(":").map(Number);
    const isPM = /pm/i.test(suffix);
    const date = new Date();
    date.setHours(isPM ? (hour % 12) + 12 : hour % 12);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const medsWithTime = medications.filter((med) => med.time);

  const pastMeds = medsWithTime
    .filter((med) => parseMedTime(med.time) < now)
    .sort((a, b) => parseMedTime(b.time) - parseMedTime(a.time));

  const futureMeds = medsWithTime
    .filter((med) => parseMedTime(med.time) >= now)
    .sort((a, b) => parseMedTime(a.time) - parseMedTime(b.time));

  const sortedMedications = [
    ...pastMeds.slice(0, 1),
    ...futureMeds.slice(0, 2),
  ];

  const handleStatusChange = (id, newStatus) => {
    setMedications((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id ? { ...med, status: newStatus } : med
      )
    );
  };

  return (
    <div className="medication-container" data-scale="large">
      <div className="medication-header">
        <h2 className="medication-header-title h4">Today's Medication</h2>
        <a href="#" className="view-all caption">
          View All
        </a>
      </div>

      <div className="medication-box">
        {sortedMedications.map((med) => (
          <div key={med.id} className={`medication-item ${med.status}`}>
            <div
              className={`med-icon-container ${
                med.status === "taken"
                  ? "green"
                  : med.status === "skipped"
                  ? "secondary"
                  : "gray"
              }`}
            >
              <span
                className={`material-symbols-rounded med-icon ${
                  med.status === "taken" || med.status === "skipped"
                    ? "filled"
                    : ""
                }`}
              >
                {med.icon}
              </span>
            </div>
            <div className="med-details">
              <div className="med-name body">{med.name}</div>
              {med.status === "pending" && med.time && (
                <div className="med-time caption">{med.time}</div>
              )}
              <div className="med-info caption">
                {med.dose} • {med.stomach}
              </div>
            </div>
            {med.status === "taken" && (
              <div className="med-status green-text caption">Taken</div>
            )}
            {med.status === "skipped" && (
              <div className="med-status secondary-text caption">Skipped</div>
            )}
            {med.status === "pending" && (
              <div className="med-actions">
                <button
                  className="btn-take caption"
                  onClick={() => handleStatusChange(med.id, "taken")}
                >
                  Take
                </button>
                <button
                  className="btn-skip caption"
                  onClick={() => handleStatusChange(med.id, "skipped")}
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationCard;
