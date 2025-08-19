import React from "react";
import "../../styles/components/dailyCheckIn.css";
import WeeklyProgressRow from "../ui/weekly_ProgressRow";
import { useNavigate } from "react-router-dom";

const DailyCheckIn = ({ currentDays = 2, longestDays = 12 }) => {
  const navigate = useNavigate();

  const handleLogToday = (e) => {
    e.preventDefault();
    navigate("/chatbot");
  };

  return (
    <div className="daily-checkin">
      <div className="header">
        <h3 className="daily-checkin-title h4">Daily Check-In</h3>
        <button className="log-button caption" onClick={handleLogToday}>
          Log Today
        </button>
      </div>

      <div className="streak-progress-row">
        <div className="streaks">
          <div className="streak">
            <span className="material-symbols-rounded iconfire">
              local_fire_department
            </span>
            <div className="days-container">
              <span className="days-amount caption">{currentDays} days</span>
              <small className="days-label caption">current</small>
            </div>
          </div>
          <div className="streak">
            <span className="material-symbols-rounded icontrophy">
              emoji_events
            </span>
            <div className="days-container">
              <span className="days-amount caption">{longestDays} days</span>
              <small className="days-label caption">longest</small>
            </div>
          </div>
        </div>

        <div className="weekly-progress">
          <span className="weekly-progress-title caption">Weekly Progress</span>
          <WeeklyProgressRow />
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
