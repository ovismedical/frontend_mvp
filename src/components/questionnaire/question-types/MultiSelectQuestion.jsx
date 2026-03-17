import React from "react";
import { vibrate } from "../../../utils/mobile";

export default function MultiSelectQuestion({ question, value, onChange }) {
  const selectedValues = value || [];

  const handleOptionToggle = (optionValue) => {
    vibrate(5);
    const newSelection = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newSelection);
  };

  return (
    <div className="multi-select-question">
      <div className="options-container" role="group" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option) => (
          <button
            key={option.value}
            className={`option-button ${selectedValues.includes(option.value) ? 'selected' : ''}`}
            aria-checked={selectedValues.includes(option.value)}
            onClick={() => handleOptionToggle(option.value)}
          >
            <span className="material-symbols-rounded option-icon">
              {selectedValues.includes(option.value) ? 'check_box' : 'check_box_outline_blank'}
            </span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
