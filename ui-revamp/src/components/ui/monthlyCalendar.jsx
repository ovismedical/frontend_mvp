import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/components/monthlyCalendar.css";

// Example symptom data
const symptomData = {
  "2025-06-01": "moderate",
  "2025-06-02": "severe",
  "2025-06-03": "moderate",
  "2025-06-04": "mild",
  "2025-06-05": "moderate",
  "2025-06-07": "severe",
  "2025-06-08": "severe",
  "2025-06-09": "severe",
  "2025-06-10": "severe",
  "2025-06-11": "mild",
  "2025-06-12": "severe",
  "2025-06-13": "moderate",
  "2025-06-15": "mild",
  "2025-06-16": "mild",
  "2025-06-17": "mild",
  "2025-06-18": "moderate",
  "2025-06-20": "severe",
  "2025-06-21": "mild",
  "2025-06-22": "severe",
  "2025-06-23": "severe",
};

const MonthlyCalendar = () => {
  const [value, setValue] = useState(new Date(2025, 5)); // June 2025

  const getTileClass = ({ date, view }) => {
    if (view !== "month") return "";

    const dateStr = date.toISOString().split("T")[0];

    switch (symptomData[dateStr]) {
      case "mild":
        return "mild";
      case "moderate":
        return "moderate";
      case "severe":
        return "severe";
      default:
        return "not-logged";
    }
  };

  return (
    <div className="calendar-container ">
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={getTileClass}
        locale="en-GB"
        navigationLabel={({ label }) => (
          <span className="calendar-label h4">{label}</span>
        )}
        prev2Label={<span className="icon-sm">«</span>}
        prevLabel={<span className="icon-sm">‹</span>}
        nextLabel={<span className="icon-sm">›</span>}
        next2Label={<span className="icon-sm">»</span>}
      />

      <div className="legend caption">
        <div>
          <span className="legend-box moderate"></span> Moderate Symptoms
        </div>
        <div>
          <span className="legend-box mild"></span> Mild Symptoms
        </div>
        <div>
          <span className="legend-box severe"></span> Severe Symptoms
        </div>
        <div>
          <span className="legend-box not-logged"></span> Not Logged
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
