import React from "react";
import "../../styles/components/notableEvents.css";

const EventItem = ({ iconName, title, subtitle, date, index }) => {
  const isEven = index % 2 === 0;

  const iconColor = isEven ? "#4a90e2" : "#6c4dd4"; // Blue for even, Purple for odd
  const bgColor = isEven ? "#e9f3ff" : "#f5f0ff"; // Light blue / light purple

  return (
    <div className="event-item">
      <div className="event-item-left">
        <div className="event-item-icon" style={{ backgroundColor: bgColor }}>
          <span
            className="material-symbols-rounded"
            style={{ color: iconColor }}
          >
            {iconName}
          </span>
        </div>
        <div className="event-item-text">
          <h4 className="event-item-title">{title}</h4>
          <p className="event-item-subtitle">{subtitle}</p>
        </div>
      </div>
      <p className="event-item-date">{date}</p>
    </div>
  );
};

export default EventItem;
