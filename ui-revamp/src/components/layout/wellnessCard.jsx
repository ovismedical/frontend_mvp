import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/wellnessCard.css";

const WellnessScoreCard = () => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [showDropdown, setShowDropdown] = useState(false);

  const chartData = {
    Weekly: {
      data: [
        { day: t("mon"), height: 60 },
        { day: t("tue"), height: 30 },
        { day: t("wed"), height: 65 },
        { day: t("thu"), height: 35 },
        { day: t("fri"), height: 100 },
        { day: t("sat"), height: 60 },
        { day: t("sun"), height: 55 },
      ],
      score: 82.5,
      percent: -12,
      insights: 8,
    },
    Monthly: {
      data: [
        { day: t("week_1"), height: 70 },
        { day: t("week_2"), height: 60 },
        { day: t("week_3"), height: 80 },
        { day: t("week_4"), height: 90 },
      ],
      score: 76.4,
      percent: 5,
      insights: 14,
    },
    Yearly: {
      data: [
        { day: t("jan"), height: 60 },
        { day: t("feb"), height: 65 },
        { day: t("mar"), height: 70 },
        { day: t("apr"), height: 80 },
        { day: t("may"), height: 85 },
        { day: t("jun"), height: 75 },
        { day: t("jul"), height: 90 },
        { day: t("aug"), height: 88 },
        { day: t("sep"), height: 92 },
        { day: t("oct"), height: 95 },
        { day: t("nov"), height: 91 },
        { day: t("dec"), height: 89 },
      ],
      score: 88.2,
      percent: 10,
      insights: 35,
    },
  };

  const blueShades = [
    "--blue-400",
    "--blue-500",
    "--blue-600",
    "--blue-700",
    "--blue-800",
  ];

  const { data, score, percent, insights } = chartData[selectedRange];
  const maxHeight = Math.max(...data.map((item) => item.height));

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleSelect = (range) => {
    setSelectedRange(range);
    setShowDropdown(false);
  };

  const timeRanges = [
    { key: "Weekly", label: t("weekly") },
    { key: "Monthly", label: t("monthly") },
    { key: "Yearly", label: t("yearly") },
  ];

  return (
    <div className="wellness-card">
      <div className="wellness-header">
        <div className="score-container">
          <div className="score">
            <span className="material-symbols-rounded star-icon">stars_2</span>
            <span className="score-value h4">{score}</span>
          </div>
          <div className="score-subtitle body">{t("your_wellness_score")}</div>
        </div>

        <div className="dropdown-wrapper">
          <div className="dropdown" onClick={toggleDropdown}>
            <span className="material-symbols-rounded date_range">
              date_range
            </span>
            <span className="dropdown-text caption">
              {timeRanges.find((range) => range.key === selectedRange)?.label}
            </span>
            <span className="material-symbols-rounded expand_more">
              expand_more
            </span>
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              {timeRanges.map((range) => (
                <div
                  key={range.key}
                  className={`dropdown-item ${
                    selectedRange === range.key ? "active" : ""
                  }`}
                  onClick={() => handleSelect(range.key)}
                >
                  {range.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bar-chart">
        {data.map((item, index) => {
          const shadeIndex = Math.floor(
            (item.height / maxHeight) * (blueShades.length - 1)
          );
          const shadeVar = blueShades[shadeIndex];

          return (
            <div key={index} className="bar-container">
              <div
                className="chart_bar"
                style={{
                  height: `${item.height}px`,
                  backgroundColor: `var(${shadeVar})`,
                }}
              ></div>
              <span className="bar-label">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="footer">
        <div className="change">
          <span
            className={`material-symbols-rounded ${
              percent < 0 ? "down-icon" : "up-icon"
            }`}
          >
            {percent < 0 ? "trending_down" : "trending_up"}
          </span>
          <span className="percent caption">
            {percent > 0 ? "+" : ""}
            {percent}%
          </span>
          <span className="percent-label caption">
            {t("vs_last")}{" "}
            {timeRanges
              .find((range) => range.key === selectedRange)
              ?.label.toLowerCase()}
          </span>
        </div>
        <div className="insights">
          <span className="material-symbols-rounded emoji-objects">
            emoji_objects
          </span>
          <span className="insight-count caption">
            {insights} {t("insights")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WellnessScoreCard;
