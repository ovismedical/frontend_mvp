import React from "react";
import { vibrate } from "../../../utils/mobile";

const BRISTOL_TYPES = [
  { value: "type_1", type: 1, label: "Separate hard lumps" },
  { value: "type_2", type: 2, label: "Lumpy, sausage-shaped" },
  { value: "type_3", type: 3, label: "Sausage with cracks" },
  { value: "type_4", type: 4, label: "Smooth, soft sausage" },
  { value: "type_5", type: 5, label: "Soft blobs, clear edges" },
  { value: "type_6", type: 6, label: "Fluffy, ragged, mushy" },
  { value: "type_7", type: 7, label: "Entirely liquid" },
];

export default function BristolChartQuestion({ question, value, onChange }) {
  const extraOptions = question.extraOptions || [];

  const handleSelect = (optionValue) => {
    vibrate(5);
    onChange(value === optionValue ? null : optionValue);
  };

  return (
    <div className="bristol-chart-question">
      <img
        src="/bristol-stool-chart.png"
        alt="Bristol Stool Chart showing Types 1 through 7"
        className="bristol-chart-image"
      />

      <div className="bristol-type-buttons" role="radiogroup" aria-label="Bristol stool type">
        {BRISTOL_TYPES.map(({ value: typeValue, type, label }) => (
          <button
            key={typeValue}
            className={`bristol-type-btn ${value === typeValue ? "selected" : ""}`}
            role="radio"
            aria-checked={value === typeValue}
            aria-label={`Type ${type}: ${label}`}
            onClick={() => handleSelect(typeValue)}
          >
            <span className="bristol-type-num">{type}</span>
            <span className="bristol-type-label">{label}</span>
          </button>
        ))}
      </div>

      {extraOptions.length > 0 && (
        <div className="bristol-extra-options">
          {extraOptions.map((opt) => (
            <button
              key={opt.value}
              className={`bristol-extra-btn ${opt.isAlert ? "alert" : ""} ${opt.isOther ? "other" : ""} ${value === opt.value ? "selected" : ""}`}
              role="radio"
              aria-checked={value === opt.value}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.isAlert && (
                <span className="material-symbols-rounded" aria-hidden="true">warning</span>
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
