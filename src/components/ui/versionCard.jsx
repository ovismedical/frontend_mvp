import React from 'react';
import "../../styles/components/versionCard.css";

const VersionCard = ({ version, title, description, date }) => {
  return (
    <div className="version-card">
      <div className="version-header">
        <span className="version-badge caption">{version}</span>
        <span className="version-date caption">{date}</span>
      </div>
      <h4 className="version-title body">{title}</h4>
      <p className="version-description caption">{description}</p>
    </div>
  );
};

export default VersionCard;
