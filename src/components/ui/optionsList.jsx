import React from "react";
import "../../styles/components/optionsList.css";

export default function OptionsList({ options, onSelect }) {
  return (
    <div className="options-scroll-container">
      {options.map((opt, idx) => (
        <button
          className="option-button caption"
          key={idx}
          type="button"
          onClick={() => onSelect(opt.value)}
        >
          {opt.icon && (
            <span className="material-symbols-rounded option-button-icon" aria-hidden="true">
              {opt.icon}
            </span>
          )}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
