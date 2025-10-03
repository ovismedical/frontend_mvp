import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/recentActivityCard.css";

const RecentActivityCard = ({ type, title, patient, time }) => {
  const { t } = useTranslation();

  const getIconName = () => {
    switch (type) {
      case "report":
        return "clinical_notes";
      case "alert":
        return "warning";
      case "prescription":
        return "prescriptions";
      case "request":
        return "group_add";
      default:
        return "info";
    }
  };

  return (
    <div className="recent-activity-card">
      <div className={`activity-icon-container ${type}`}>
        <span className="material-symbols-rounded activity-icon">
          {getIconName()}
        </span>
      </div>

      <div className="activity-info">
        <p className="activity-title body">{title}</p>
        <p className="activity-subtitle caption">
          {t("patient")} <span className="patient-name">{patient}</span> •{" "}
          {time}
        </p>
      </div>
    </div>
  );
};

export default RecentActivityCard;
