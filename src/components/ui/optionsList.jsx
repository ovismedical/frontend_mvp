import React from "react";
import "../../styles/components/optionsList.css";

export default function OptionsList({ options, onSelect }) {
  return (
    <div className="options-scroll-container">
      {options.map((opt, idx) => (
        <button className="option-button caption" key={idx} onClick={() => onSelect(opt.value)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
