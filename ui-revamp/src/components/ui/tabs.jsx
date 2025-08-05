import React, { useState } from "react";
import "../../styles/components/tabs.css";

const Tabs = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.name);

  const handleTabClick = (tabName) => {
    if (tabName !== activeTab) {
      setActiveTab(tabName);
      onTabChange(tabName);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`tab-button ${
              activeTab === tab.name ? "active" : ""
            } caption-semibold`}
            onClick={() => handleTabClick(tab.name)}
            disabled={activeTab === tab.name}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
