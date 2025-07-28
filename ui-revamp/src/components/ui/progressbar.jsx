import React from "react";
import "../../styles/components/progressbar.css";

const ProgressBar = ({ currentStep = 1, totalSteps = 1 }) => {
  const percentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="progress-bar-wrapper">
      <div
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
