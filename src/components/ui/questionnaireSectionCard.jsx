import React from "react";
import { getSeverityConfig } from "../../utils/severityUtils";
import "../../styles/components/questionnaireSectionCard.css";

const QuestionnaireSectionCard = ({ iconName, title, severityScore, sectionData, onClick }) => {
  const severity = getSeverityConfig(severityScore);

  const handleClick = () => {
    if (onClick && sectionData) {
      onClick(sectionData);
    }
  };

  return (
    <div
      className={`qs-card ${onClick ? "clickable" : ""}`}
      onClick={handleClick}
    >
      <div className="qs-card-left">
        <div className="qs-card-icon" style={{ backgroundColor: severity.bg }}>
          <span
            className="material-symbols-rounded"
            style={{ color: severity.color, fontVariationSettings: '"FILL" 1' }}
          >
            {iconName}
          </span>
        </div>
        <div className="qs-card-info">
          <h4 className="qs-card-title body">{title}</h4>
          <span className={`qs-severity-pill ${severity.semantic}`}>
            {severity.label}
          </span>
        </div>
      </div>
      {onClick && (
        <span className="material-symbols-rounded qs-click-indicator">info</span>
      )}
    </div>
  );
};

export default QuestionnaireSectionCard;
