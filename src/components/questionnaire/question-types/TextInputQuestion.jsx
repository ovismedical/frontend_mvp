import React from "react";

export default function TextInputQuestion({ question, value, onChange }) {
  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="text-input-question">
      <textarea
        className="text-input"
        value={value || ""}
        onChange={handleTextChange}
        placeholder={question.placeholder || "Please provide details..."}
        rows={question.rows || 3}
      />
    </div>
  );
}






