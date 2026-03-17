import React from "react";
import { vibrate } from "../../../utils/mobile";

export default function ColorChartQuestion({ question, value, onChange }) {
  const selectedColors = value || [];

  const handleColorClick = (colorValue) => {
    vibrate(5);
    const newSelection = selectedColors.includes(colorValue)
      ? selectedColors.filter(v => v !== colorValue)
      : [...selectedColors, colorValue];
    onChange(newSelection);
  };

  return (
    <div className="color-chart-question">
      <div className="color-options" role="group" aria-labelledby={`question-${question.id}`}>
        {question.colorOptions?.map((color) => (
          <button
            key={color.value}
            className={`color-option ${selectedColors.includes(color.value) ? 'selected' : ''}`}
            aria-pressed={selectedColors.includes(color.value)}
            onClick={() => handleColorClick(color.value)}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <span className="color-label">{color.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
