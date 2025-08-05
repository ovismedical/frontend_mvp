import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/ui/tabs";
import DailyDashboard from "./daily";
import WeeklyDashboard from "./weekly";
import MonthlyDashboard from "./monthly";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Today");

  const tabs = [{ name: "Today" }, { name: "This Week" }, { name: "Monthly" }];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        ></span>

        <div className="dashboard-header h4">Health Dashboard</div>
        <span className="material-symbols-rounded file_save">file_save</span>
      </div>

      <Tabs tabs={tabs} onTabChange={handleTabChange} />

      <div className="dashboard-content">
        {activeTab === "Today" && <DailyDashboard />}
        {activeTab === "This Week" && <WeeklyDashboard />}
        {activeTab === "Monthly" && <MonthlyDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
