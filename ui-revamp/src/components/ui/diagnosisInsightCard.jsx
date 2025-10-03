import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "../../styles/components/diagnosisInsightCard.css";

const DiagnosisInsightCard = ({ 
  suspectedDiagnosis, 
  probability, 
  urgency, 
  reasoning 
}) => {
  const { t } = useTranslation();
  
  const getProbabilityConfig = (prob) => {
    switch (prob) {
      case "high":
        return {
          icon: "trending_up",
          color: "warning",
          label: t("high_likelihood"),
          description: t("strong_clinical_evidence")
        };
      case "medium":
        return {
          icon: "trending_flat",
          color: "info",
          label: t("possible"),
          description: t("moderate_evidence")
        };
      case "low":
        return {
          icon: "trending_down",
          color: "success",
          label: t("unlikely"),
          description: t("limited_evidence")
        };
      default:
        return {
          icon: "help",
          color: "info",
          label: "Unknown",
          description: "Assessment pending"
        };
    }
  };

  const getUrgencyConfig = (urg) => {
    switch (urg) {
      case 1:
        return { label: t("routine"), color: "success", icon: "schedule" };
      case 2:
        return { label: t("follow_up"), color: "info", icon: "calendar_today" };
      case 3:
        return { label: t("this_week"), color: "warning", icon: "event" };
      case 4:
        return { label: t("same_day"), color: "error", icon: "schedule" };
      case 5:
        return { label: t("emergency"), color: "error", icon: "emergency" };
      default:
        return { label: "Unknown", color: "info", icon: "help" };
    }
  };

  const probConfig = getProbabilityConfig(probability);
  const urgConfig = getUrgencyConfig(urgency);

  return (
    <div className="diagnosis-insight-card">
      <div className="diagnosis-header">
        <div className="diagnosis-title-section">
          <h4 className="diagnosis-title body-semibold">{suspectedDiagnosis}</h4>
          <div className="diagnosis-badges">
            <span className={`probability-badge ${probConfig.color}`}>
              <span className="material-symbols-rounded badge-icon">
                {probConfig.icon}
              </span>
              <span className="badge-text caption">{probConfig.label}</span>
            </span>
            <span className={`urgency-badge ${urgConfig.color}`}>
              <span className="material-symbols-rounded badge-icon">
                {urgConfig.icon}
              </span>
              <span className="badge-text caption">{urgConfig.label}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="diagnosis-details">
        <div className="probability-info">
          <span className="material-symbols-rounded info-icon">info</span>
          <span className="info-text caption">{probConfig.description}</span>
        </div>
        
        {reasoning && (
          <div className="diagnosis-reasoning">
            <p className="reasoning-text caption">{reasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
};

DiagnosisInsightCard.propTypes = {
  suspectedDiagnosis: PropTypes.string.isRequired,
  probability: PropTypes.oneOf(["low", "medium", "high"]).isRequired,
  urgency: PropTypes.number.isRequired,
  reasoning: PropTypes.string,
};

export default DiagnosisInsightCard;
