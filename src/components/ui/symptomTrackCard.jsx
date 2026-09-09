// Backend Handling: Fetch symptom tracking data from backend
import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/symptomTrackCard.css";

const getStatus = (intensity) => {
  if (intensity <= 3) return "down";
  if (intensity <= 6) return "stable";
  return "up";
};

const statusMap = {
  up: {
    icon: "trending_up",
    color: "var(--on-success-tint)",
    backgroundColor: "var(--success-50)",
  },
  down: {
    icon: "trending_down",
    color: "var(--on-error-tint)",
    backgroundColor: "var(--error-50)",
  },
  stable: {
    icon: "trending_flat",
    color: "var(--on-info-tint)",
    backgroundColor: "var(--info-50)",
  },
};

const SymptomTrackCard = ({ iconName, title, intensity, symptomData, onClick }) => {
  const { t } = useTranslation();
  const status = getStatus(intensity);
  const statusData = statusMap[status];

  const handleClick = () => {
    if (onClick && symptomData) {
      onClick(symptomData);
    }
  };

  return (
    <div 
      className={`symptom-track-card ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="symptom-track-left">
        <div
          className="symptom-track-icon"
          style={{ backgroundColor: statusData.backgroundColor }}
        >
          <span
            className="material-symbols-rounded"
            style={{
              color: statusData.color,
              fontVariationSettings: '"FILL" 1',
            }}
          >
            {iconName}
          </span>
        </div>
        <div className="symptom-track-info">
          <h4 className="symptom-track-title body">{title.charAt(0).toUpperCase() + title.slice(1)}</h4>
          <div className="symptom-track">
            <span className="symptom-intensity caption" style={{ color: statusData.color }}>
              {t("intensity")}: {intensity}/10
            </span>
            <span
              className="material-symbols-rounded track-icon"
              style={{ color: statusData.color }}
            >
              {statusData.icon}
            </span>
          </div>
        </div>
      </div>
      {onClick && (
        <span className="material-symbols-rounded click-indicator">
          info
        </span>
      )}
    </div>
  );
};

export default SymptomTrackCard;
