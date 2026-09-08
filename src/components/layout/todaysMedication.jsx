import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/todaysMedication.css";
import { useNavigate } from "react-router-dom";
import StatusBanner from "../../components/ui/statusBanner";

const TodaysMedication = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Backend Handling: Fetch user's medication data for today
  const initialMedications = [
    {
      id: 1,
      name: t("medication_f"),
      dose: t("medication_dose_vial", { count: 1 }),
      time: "9:00am",
      stomach: t("with_food"),
      icon: "pill",
      status: "skipped",
    },
    {
      id: 2,
      name: t("medication_g"),
      dose: t("medication_dose_pills", { count: 2 }),
      time: "10:30am",
      stomach: t("empty_stomach"),
      icon: "pill",
      status: "taken",
    },
    {
      id: 3,
      name: t("medication_a"),
      dose: t("medication_dose_pill", { count: 1 }),
      time: "8:00am",
      stomach: t("with_food"),
      icon: "medication_liquid",
      status: "taken",
    },
    {
      id: 4,
      name: t("medication_h"),
      dose: t("medication_dose_tablet", { count: 1 }),
      time: "12:00pm",
      stomach: t("with_food"),
      icon: "pill",
      status: "skipped",
    },
    {
      id: 5,
      name: t("medication_i"),
      dose: t("medication_dose_infusion", { count: 1 }),
      time: "1:30pm",
      stomach: t("before_meal"),
      icon: "medication_liquid",
      status: "skipped",
    },
    {
      id: 6,
      name: t("medication_j"),
      dose: t("medication_dose_pills", { count: 2 }),
      time: "6:00pm",
      stomach: t("empty_stomach"),
      icon: "pill",
      status: "pending",
    },
    {
      id: 7,
      name: t("medication_k"),
      dose: t("medication_dose_pill", { count: 1 }),
      time: "7:30pm",
      stomach: t("with_food"),
      icon: "pill",
      status: "taken",
    },
  ];

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
  // Backend Handling: Push updated medication status to backend
  const handleStatusChange = (id, newStatus) => {
    setMedications((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id ? { ...med, status: newStatus } : med
      )
    );
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate("/medication");
  };

  return (
    <div className="medication-container">
      <div className="medication-header">
        <h2 className="medication-header-title h4">{t("todays_medication")}</h2>
        <a href="#" className="view-all caption" onClick={handleViewAll}>
          {t("view_all")}
        </a>
      </div>

      <StatusBanner variant="sample" message={t("medication_sample_message")} />
      <div className="medication-box">
        {sortedMedications.map((med) => (
          <div key={med.id} className={`medication-item ${med.status}`}>
            <div
              className={`med-icon-container ${
                med.status === "taken"
                  ? "green"
                  : med.status === "skipped"
                  ? "med-secondary"
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
              <div className="med-status green-text caption">{t("taken")}</div>
            )}
            {med.status === "skipped" && (
              <div className="med-status secondary-text caption">
                {t("skipped")}
              </div>
            )}
            {med.status === "pending" && (
              <div className="med-actions">
                <button
                  className="btn-take caption"
                  onClick={() => handleStatusChange(med.id, "taken")}
                >
                  {t("take")}
                </button>
                <button
                  className="btn-skip caption"
                  onClick={() => handleStatusChange(med.id, "skipped")}
                >
                  {t("skip")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysMedication;
