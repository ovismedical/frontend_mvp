import React from "react";
import PropTypes from "prop-types";
import "../../styles/components/smartInsightCard.css";

const SmartInsightCard = ({
  icon,
  title,
  description,
  insightType = "info",
}) => {
  return (
    <div className={`smart-insight-card ${insightType}`}>
      <div className="insight-icon">
        <span className="material-symbols-rounded">{icon}</span>
      </div>
      <div className="insight-content">
        <h4 className="insight-title body-semibold">{title}</h4>
        <p className="insight-description caption">{description}</p>
      </div>
    </div>
  );
};

SmartInsightCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  insightType: PropTypes.oneOf(["info", "success", "warning", "error"]),
};

export default SmartInsightCard;
