import React from "react";
import { vibrate } from "../../../utils/mobile";

const TIER_CLASSES = ["tier-0", "tier-1", "tier-2", "tier-3", "tier-4"];

export default function FrequencyScale({ question, value, onChange }) {
  if (!question || !question.options) return null;

  const handleSelect = (optionValue) => {
    if (optionValue !== value) {
      vibrate(5);
      onChange(optionValue);
    }
  };

  return (
    <div
      className="frequency-scale"
      role="radiogroup"
      aria-labelledby={`question-${question.id}`}
    >
      {question.options.map((option, index) => {
        const isSelected = value === option.value;
        const tier = TIER_CLASSES[index] || TIER_CLASSES[TIER_CLASSES.length - 1];

        return (
          <button
            key={option.value}
            className={`frequency-row ${tier}${isSelected ? " selected" : ""}`}
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(option.value)}
          >
            <span className="frequency-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
