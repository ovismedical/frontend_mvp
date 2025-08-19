import React from "react";
import "../../styles/components/symptomTrackCard.css";

const getStatus = (intensity) => {
  if (intensity <= 3) return "down";
  if (intensity <= 6) return "stable";
  return "up";
};

const statusMap = {
  up: {
    icon: "trending_up",
    color: "var(--success-600)",
    backgroundColor: "var(--success-50)",
  },
  down: {
    icon: "trending_down",
    color: "var(--error-600)",
    backgroundColor: "var(--error-50)",
  },
  stable: {
    icon: "trending_flat",
    color: "var(--info-600)",
    backgroundColor: "var(--info-50)",
  },
};

const SymptomTrackCard = ({ iconName, title, intensity }) => {
  const status = getStatus(intensity);
  const statusData = statusMap[status];

  return (
    <div className="symptom-track-card">
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
          <h4 className="symptom-track-title body">{title}</h4>
          <div
            className="symptom-track caption"
            style={{ color: statusData.color }}
          >
            <span>Intensity: {intensity}/10</span>
          </div>
        </div>
      </div>

      <span
        className="material-symbols-rounded track-icon"
        style={{ color: statusData.color }}
      >
        {statusData.icon}
      </span>
    </div>
  );
};

export default SymptomTrackCard;
