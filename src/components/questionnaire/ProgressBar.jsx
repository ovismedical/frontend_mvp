import React from "react";

export default function ProgressBar({ current, total, progress }) {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="h4">Section {current} of {total}</span>
        <span className="body">{progress}% Complete</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}






