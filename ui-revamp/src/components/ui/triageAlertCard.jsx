import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "../../styles/components/triageAlertCard.css";

const TriageAlertCard = ({ 
  alertLevel, 
  alertRationale, 
  recommendedTimeline, 
  confidenceLevel,
  keySymptoms = []
}) => {
  const { t } = useTranslation();
  
  const getAlertConfig = (level) => {
    switch (level) {
      case "GREEN":
        return {
          icon: "check_circle",
          color: "success",
          title: t("all_good"),
          description: t("symptoms_within_normal")
        };
      case "YELLOW":
        return {
          icon: "info",
          color: "info",
          title: t("monitor_closely"),
          description: t("keep_tracking_symptoms")
        };
      case "ORANGE":
        return {
          icon: "warning",
          color: "warning",
          title: t("attention_needed"),
          description: t("consider_followup")
        };
      case "RED":
        return {
          icon: "error",
          color: "error",
          title: t("urgent_care"),
          description: t("contact_healthcare_provider")
        };
      default:
        return {
          icon: "help",
          color: "info",
          title: t("assessment_pending"),
          description: t("assessment_being_reviewed")
        };
    }
  };

  const getConfidenceIcon = (level) => {
    switch (level) {
      case "high":
        return "verified";
      case "medium":
        return "trending_up";
      case "low":
        return "trending_down";
      default:
        return "help";
    }
  };

  const config = getAlertConfig(alertLevel);

  return (
    <div className={`triage-alert-card ${config.color}`}>
      <div className="triage-alert-header">
        <div className="triage-alert-icon">
          <span className="material-symbols-rounded">{config.icon}</span>
        </div>
        <div className="triage-alert-content">
          <h3 className="triage-alert-title body-semibold">{config.title}</h3>
          <p className="triage-alert-description caption">{config.description}</p>
        </div>
        <div className="triage-confidence">
          <span className="material-symbols-rounded confidence-icon">
            {getConfidenceIcon(confidenceLevel)}
          </span>
        </div>
      </div>
      
      {alertRationale && (
        <div className="triage-alert-details">
          <p className="triage-rationale caption">{alertRationale}</p>
        </div>
      )}
      
      {recommendedTimeline && (
        <div className="triage-timeline">
          <span className="material-symbols-rounded timeline-icon">schedule</span>
          <span className="timeline-text caption">Recommended: {recommendedTimeline}</span>
        </div>
      )}
      
      {keySymptoms.length > 0 && (
        <div className="triage-symptoms">
          <span className="material-symbols-rounded symptoms-icon">health_and_safety</span>
          <div className="symptoms-list">
            {keySymptoms.slice(0, 3).map((symptom, index) => (
              <span key={index} className="symptom-tag caption">
                {symptom}
              </span>
            ))}
            {keySymptoms.length > 3 && (
              <span className="symptom-tag caption">
                +{keySymptoms.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

TriageAlertCard.propTypes = {
  alertLevel: PropTypes.oneOf(["GREEN", "YELLOW", "ORANGE", "RED"]),
  alertRationale: PropTypes.string,
  recommendedTimeline: PropTypes.string,
  confidenceLevel: PropTypes.oneOf(["low", "medium", "high"]),
  keySymptoms: PropTypes.arrayOf(PropTypes.string),
};

export default TriageAlertCard;
