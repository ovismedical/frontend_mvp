import React, { useState } from "react";
import "../../styles/components/assessment_tab.css";

const AssessmentTab = ({ options, onSelect }) => {
  const [activeTab, setActiveTab] = useState(options[0]);

  const handleTabClick = (option) => {
    setActiveTab(option);
    onSelect(option); // Notify parent of the selected option
  };

  return (
    <div className="tab-container">
      {options.map((option) => (
        <div
          key={option}
          className={`tab-item ${activeTab === option ? "active" : ""} body`}
          onClick={() => handleTabClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default AssessmentTab;
