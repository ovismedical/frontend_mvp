import React from "react";
import "../../styles/components/overviewCard.css";

const OverviewCard = ({
  icon,
  changeIcon = "arrow_upward_alt",
  changeValue,
  cardValue,
  cardTitle,
  changeClass = "positive",
  variant = "",
}) => (
  <div className={`doctor-home-overview-card${variant ? ` ${variant}` : ""}`}>
    <div className="doctor-home-overview-card-row">
      <div
        className={`material-symbols-rounded icon${
          variant === "blue" ? " blue" : ""
        }`}
      >
        {icon}
      </div>
      <div className="doctor-home-overview-card-change">
        <div className={`material-symbols-rounded change-icon ${changeClass}`}>
          {changeIcon}
        </div>
        <p
          className={`doctor-home-overview-card-change-value ${changeClass} body`}
        >
          {changeValue}
        </p>
      </div>
    </div>
    <div className="doctor-home-overview-card-info">
      <p
        className={`doctor-home-overview-card-value h3${
          variant === "blue" ? " blue" : ""
        }`}
      >
        {cardValue}
      </p>
      <p
        className={`doctor-home-overview-card-title ${
          variant === "blue" ? " blue" : ""
        } body`}
      >
        {cardTitle}
      </p>
    </div>
  </div>
);

export default OverviewCard;
