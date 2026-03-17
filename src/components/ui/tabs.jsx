import React from "react";
import "../../styles/components/tabs.css";

const Tabs = ({ tabs, onTabChange, activeTab, scrollable = false }) => {
  const handleTabClick = (tabName) => {
    if (tabName !== activeTab) {
      onTabChange(tabName);
    }
  };

  return (
    <div className="tabs-container">
      <div className={`tabs ${scrollable ? "tabs-scrollable" : ""}`}>
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
