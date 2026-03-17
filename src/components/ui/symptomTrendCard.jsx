import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/symptomTrendCard.css";

const SymptomTrendCard = ({ iconName, title, trend }) => {
  const { t } = useTranslation();

  const trendMap = {
    up: {
      label: t("trending_up"),
      icon: "trending_up",
      color: "var(--success-600)",
      backgroundColor: "var(--success-50)",
    },
    down: {
      label: t("trending_down"),
      icon: "trending_down",
      color: "var(--error-600)",
      backgroundColor: "var(--error-50)",
    },
    stable: {
      label: t("trending_stable"),
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
          <div
            className="symptom-trend caption"
            style={{ color: trendData.color }}
          >
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

      <button className="symptom-chart-button caption">{t("chart")}</button>
    </div>
  );
};

export default SymptomTrendCard;
