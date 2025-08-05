import React from "react";
import "../../styles/components/weekly_progressRow.css";

const ProgressRow = ({ labelFormat = "short", labelPosition = "below" }) => {
  const checkedInIndexes = [1, 2];

  // const todayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  const todayIndex = 4; // For testing purposes, set to Tuesday

  const daysOfWeek = [
    { labelShort: "M", labelFull: "Mon", index: 0 }, // Monday
    { labelShort: "T", labelFull: "Tue", index: 1 },
    { labelShort: "W", labelFull: "Wed", index: 2 },
    { labelShort: "T", labelFull: "Thu", index: 3 },
    { labelShort: "F", labelFull: "Fri", index: 4 },
    { labelShort: "S", labelFull: "Sat", index: 5 },
    { labelShort: "S", labelFull: "Sun", index: 6 }, // Sunday
  ];

  const getLabel = (day) =>
    labelFormat === "short" ? day.labelShort : day.labelFull;

  return (
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
            {labelPosition === "above" && (
              <span className={`day-label overline`}>{getLabel(day)}</span>
            )}
            <span
              className={`material-symbols-rounded day-icon ${statusClass}`}
            >
              {isChecked ? "check_circle" : "circle"}
            </span>
            {labelPosition === "below" && (
              <span className={`day-label overline`}>{getLabel(day)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressRow;
