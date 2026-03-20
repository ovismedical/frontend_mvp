import React, { useState } from "react";
import SegmentedControl from "../ui/SegmentedControl";
import BottomSheetPicker from "../ui/BottomSheetPicker";
import FrequencyScale from "./FrequencyScale";
import { vibrate } from "../../../utils/mobile";

const FREQUENCY_VALUES = new Set(["none", "1-2", "3-4", "5-6", "6+"]);

export default function SingleSelectQuestion({ question, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  if (!question || !question.options) return null;

  const handleOptionClick = (optionValue) => {
    if (optionValue !== value) {
      vibrate(5);
    onChange(optionValue);
    }
  };

  // Determine display mode
  const optionCount = question.options.length;
  const avgLabelLength = question.options.reduce((acc, curr) => acc + curr.label.length, 0) / optionCount;

  // Frequency scale: exact 5-option frequency pattern
  const isFrequency = optionCount === 5 &&
    question.options.every(o => FREQUENCY_VALUES.has(o.value));

  if (isFrequency) {
    return (
      <div className="single-select-question">
        <FrequencyScale question={question} value={value} onChange={onChange} />
      </div>
    );
  }

  // Mode logic
  const isSegmented = optionCount <= 3 && avgLabelLength < 20;
  const isPicker = optionCount >= 8;

  if (isSegmented) {
    return (
      <div className="single-select-question">
        <SegmentedControl
          options={question.options}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  if (isPicker) {
    const selectedLabel = question.options.find(o => o.value === value)?.label || "Select an option";
    
    return (
      <div className="single-select-question">
        <button 
          className={`option-button ${value ? 'selected' : ''}`}
          onClick={() => {
            vibrate(5);
            setShowPicker(true);
          }}
        >
          <span className="option-label" style={{ fontWeight: value ? 600 : 400 }}>
            {value ? selectedLabel : "Tap to select..."}
          </span>
          <span className="material-symbols-rounded option-icon" style={{ marginRight: 0 }}>
            unfold_more
          </span>
        </button>

        <BottomSheetPicker
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          options={question.options}
          value={value}
          onChange={onChange}
          label={question.text}
        />
      </div>
    );
  }

  // Default List View
  return (
    <div className="single-select-question">
      <div className="options-container" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option) => (
          <button
            key={option.value}
            className={`option-button ${value === option.value ? 'selected' : ''}`}
            role="radio"
            aria-checked={value === option.value}
            onClick={() => handleOptionClick(option.value)}
          >
            <span className="material-symbols-rounded option-icon">
              {value === option.value ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
