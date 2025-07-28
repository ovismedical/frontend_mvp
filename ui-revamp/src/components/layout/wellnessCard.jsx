import React, { useState } from "react";
import "../../styles/components/wellnessCard.css";

const chartData = {
  Weekly: {
    data: [
      { day: "Mon", height: 60 },
      { day: "Tue", height: 30 },
      { day: "Wed", height: 65 },
      { day: "Thu", height: 35 },
      { day: "Fri", height: 100 },
      { day: "Sat", height: 60 },
      { day: "Sun", height: 55 },
    ],
    score: 82.5,
    percent: -12,
    insights: 8,
  },
  Monthly: {
    data: [
      { day: "Week 1", height: 70 },
      { day: "Week 2", height: 60 },
      { day: "Week 3", height: 80 },
      { day: "Week 4", height: 90 },
    ],
    score: 76.4,
    percent: 5,
    insights: 14,
  },
  Yearly: {
    data: [
      { day: "Jan", height: 60 },
      { day: "Feb", height: 65 },
      { day: "Mar", height: 70 },
      { day: "Apr", height: 80 },
      { day: "May", height: 85 },
      { day: "Jun", height: 75 },
      { day: "Jul", height: 90 },
      { day: "Aug", height: 88 },
      { day: "Sep", height: 92 },
      { day: "Oct", height: 95 },
      { day: "Nov", height: 91 },
      { day: "Dec", height: 89 },
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

const WellnessScoreCard = () => {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data, score, percent, insights } = chartData[selectedRange];
  const maxHeight = Math.max(...data.map((item) => item.height));

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleSelect = (range) => {
    setSelectedRange(range);
    setShowDropdown(false);
  };

  return (
    <div className="wellness-card" data-scale="large">
      <div className="wellness-header">
        <div className="score-container">
          <div className="score">
            <span className="material-symbols-rounded star-icon">stars_2</span>
            <span className="score-value h4">{score}</span>
          </div>
          <div className="score-subtitle body">Your Wellness Score</div>
        </div>

        <div className="dropdown-wrapper">
          <div className="dropdown" onClick={toggleDropdown}>
            <span className="material-symbols-rounded date_range">
              date_range
            </span>
            <span className="dropdown-text caption">{selectedRange}</span>
            <span className="material-symbols-rounded expand_more">
              expand_more
            </span>
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              {["Weekly", "Monthly", "Yearly"].map((range) => (
                <div
                  key={range}
                  className={`dropdown-item ${
                    selectedRange === range ? "active" : ""
                  }`}
                  onClick={() => handleSelect(range)}
                >
                  {range}
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
                className="bar"
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
            vs last {selectedRange.toLowerCase()}
          </span>
        </div>
        <div className="insights">
          <span className="material-symbols-rounded emoji-objects">
            emoji_objects
          </span>
          <span className="insight-count caption">{insights} insights</span>
        </div>
      </div>
    </div>
  );
};

export default WellnessScoreCard;
