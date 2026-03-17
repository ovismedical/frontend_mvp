import React from 'react';
import { vibrate } from '../../../utils/mobile';

export default function SegmentedControl({ options, value, onChange }) {
  const handleSelect = (val) => {
    if (val !== value) {
      vibrate(10);
      onChange(val);
    }
  };

  return (
    <div className="segmented-control" role="radiogroup">
      {options.map((option) => (
        <button
          key={option.value}
          className={`segment-button ${value === option.value ? 'active' : ''}`}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

