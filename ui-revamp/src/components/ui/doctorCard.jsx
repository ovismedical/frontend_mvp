import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/doctorCard.css";

export default function DoctorCard() {
  const { t } = useTranslation();

  return (
    <div className="doctor-card">
      <div className="top-section">
        <div className="doctor-image">
          <img
            src="https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Dr. Sarah Chen"
          />
        </div>
        <div className="doctor-info">
          <h2 className="doctor-info-name body">Dr. Sarah Chen</h2>
          <p className="doctor-info-specialty caption">
            {t("breast_oncologist")}
          </p>
          <p className="doctor-info-center overline-timestamp">
            {t("memorial_cancer_center")}
          </p>
        </div>
      </div>

      <div className="bottom-section">
        <div className="info-line">
          <span className="material-symbols-rounded icon">call</span>
          <span className="doctor-card-number caption">(+852) 1234-5678</span>
        </div>
        <div className="info-line">
          <span className="material-symbols-rounded icon">mail</span>
          <span className="doctor-card-email caption">
            s.chen@memorialcancer.org
          </span>
        </div>
        <div className="info-line">
          <span className="material-symbols-rounded icon">schedule</span>
          <span className="doctor-card-schedule caption">
            {t("schedule_hours")}
          </span>
        </div>
      </div>
    </div>
  );
}
