import React, { useState } from "react";
import "../../styles/components/sideEffectInput.css";

const SideEffectInput = ({
  label,
  category,
  sideEffects,
  setSideEffects,
  placeholder,
}) => {
  const [tempInput, setTempInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tempInput.trim().replace(/,$/, "");
      if (value) {
        setSideEffects((prev) => ({
          ...prev,
          [category]: [...prev[category], value],
        }));
        setTempInput("");
      }
    }
  };

  const removeEffect = (index) => {
    setSideEffects((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="side-effect-field caption">
      <label>{label}</label>
      <div className="side-effect-input caption">
        {sideEffects[category].map((s, idx) => (
          <span key={idx} className="side-effect-chip">
            {s}
            <span className="chip-remove" onClick={() => removeEffect(idx)}>
              &times;
            </span>
          </span>
        ))}
        <input
          className="caption"
          type="text"
          value={tempInput}
          onChange={(e) => setTempInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={sideEffects[category].length ? "" : placeholder}
        />
      </div>
    </div>
  );
};

export default SideEffectInput;
