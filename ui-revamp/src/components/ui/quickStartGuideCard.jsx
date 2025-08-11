import React from "react";
import "../../styles/components/quickStartGuideCard.css";

export default function QuickStartGuideCard({
  icon,
  subtext,
  title,
  variant = "blue",
}) {
  return (
    <div
      className={`quick-start-guide-card quick-start-guide-card--${variant}`}
    >
      <span className="material-symbols-rounded quick-start-guide-card__icon">
        {icon}
      </span>

      <span className="quick-start-guide-card__subtext caption">{subtext}</span>

      <span className="quick-start-guide-card__title body">{title}</span>
    </div>
  );
}
