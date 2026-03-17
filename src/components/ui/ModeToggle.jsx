import React from "react";
import "../../styles/components/modeToggle.css";

export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="mode-toggle">
      <button
        className={`mode-toggle-option ${mode === "ai" ? "active" : ""}`}
        onClick={() => onChange("ai")}
      >
        <span className="material-symbols-rounded mode-toggle-icon">smart_toy</span>
        <span className="mode-toggle-label">AI Chat</span>
      </button>
      <button
        className={`mode-toggle-option ${mode === "form" ? "active" : ""}`}
        onClick={() => onChange("form")}
      >
        <span className="material-symbols-rounded mode-toggle-icon">assignment</span>
        <span className="mode-toggle-label">Questionnaire</span>
      </button>
      <div
        className="mode-toggle-slider"
        style={{ transform: mode === "form" ? "translateX(100%)" : "translateX(0)" }}
      />
    </div>
  );
}
