import React from "react";
import "../../styles/components/dailyCheckIn.css";

const DailyCheckIn = ({ currentDays = 2, longestDays = 12 }) => {
  const daysOfWeek = [
    { label: "M", index: 0 }, // Monday
    { label: "T", index: 1 },
    { label: "W", index: 2 },
    { label: "T", index: 3 },
    { label: "F", index: 4 },
    { label: "S", index: 5 },
    { label: "S", index: 6 }, // Sunday
  ];

  const checkedInIndexes = [1, 2];

  // const todayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  const todayIndex = 4; // For testing purposes, set to Tuesday

  return (
    <div className="daily-checkin" data-scale="large">
      <div className="header">
        <h3 className="daily-checkin-title h4">Daily Check-In</h3>
        <button className="log-button caption">Log Today</button>
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
          <div className="progress-row">
            {daysOfWeek.map((day, i) => {
              const isChecked = checkedInIndexes.includes(day.index);
              const isToday = day.index === todayIndex;
              const isPast =
                day.index < todayIndex || (todayIndex === 0 && day.index !== 0); // Sunday edge case

              let statusClass = "";
              if (isChecked) {
                statusClass = "checked";
              } else if (isToday) {
                statusClass = "today";
              } else if (isPast) {
                statusClass = "missed";
              } else {
                statusClass = "upcoming";
              }

              return (
                <div key={i} className="day-card">
                  <span
                    className={`material-symbols-rounded day-icon ${statusClass}`}
                  >
                    {isChecked ? "check_circle" : "circle"}
                  </span>
                  <span className="day-label overline">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
