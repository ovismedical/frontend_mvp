import React from "react";
import "../../styles/components/symptomTrendCard.css";

const SymptomTrendCard = ({ iconName, title, trend }) => {
  const trendMap = {
    up: {
      label: "Trending Up",
      icon: "trending_up",
      color: "var(--success-600)",
      backgroundColor: "var(--success-50)",
    },
    down: {
      label: "Trending Down",
      icon: "trending_down",
      color: "var(--error-600)",
      backgroundColor: "var(--error-50)",
    },
    stable: {
      label: "Stable",
      icon: "trending_flat",
      color: "var(--info-600)",
      backgroundColor: "var(--info-50)",
    },
  };

  const trendData = trendMap[trend];

  return (
    <div className="symptom-card">
      <div className="symptom-left">
        <div
          className="symptom-icon"
          style={{ backgroundColor: trendData.backgroundColor }}
        >
          <span
            className="material-symbols-rounded"
            style={{
              color: trendData.color,
              fontVariationSettings: '"FILL" 1',
            }}
          >
            {iconName}
          </span>
        </div>
        <div className="symptom-info">
          <h4 className="symptom-title body">{title}</h4>
          <div className="symptom-trend caption" style={{ color: trendData.color }}>
            <span
              className="material-symbols-rounded trend-icon"
              style={{ color: trendData.color }}
            >
              {trendData.icon}
            </span>
            <span>{trendData.label}</span>
          </div>
        </div>
      </div>

      <button className="symptom-chart-button caption">Chart</button>
    </div>
  );
};

export default SymptomTrendCard;
