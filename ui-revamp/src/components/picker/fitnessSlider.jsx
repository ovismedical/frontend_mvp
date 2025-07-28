import React, { useState } from "react";
import "../../styles/components/picker/fitnessSlider.css";

const fitnessLevels = [
  { level: 1, title: "Sedentary", desc: "I rarely exercise" },
  { level: 2, title: "Lightly Active", desc: "I walk or do light exercise" },
  { level: 3, title: "Moderate", desc: "I exercise 1–2 times weekly" },
  { level: 4, title: "Athletic", desc: "I exercise 3–4 times weekly" },
  { level: 5, title: "Very Athletic", desc: "I exercise 5–6 times weekly" },
];

const FitnessLevelSlider = ({ onChange }) => {
  const [level, setLevel] = useState(1);

  const handleChange = (e) => {
    const newLevel = parseInt(e.target.value);
    setLevel(newLevel);
    if (onChange) onChange(newLevel);
  };

  const { title, desc } = fitnessLevels[level - 1];

  return (
    <div className="fitness-slider-container" data-scale="large">
      <p className="level-indicator h4">Level {level}</p>
      <div className="slider-wrapper">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={level}
          onChange={handleChange}
          className="styled-slider"
          style={{ "--progress": (level - 1) / 4 }}
        />
      </div>

      <div className="fitness-label">
        <h2 className="h1">{title}</h2>
        <p className="body">{desc}</p>
        <span className="info-text caption">
          <span className="material-symbols-rounded info-icon">info</span>
          Drag the slider to adjust
        </span>
      </div>
    </div>
  );
};

export default FitnessLevelSlider;
