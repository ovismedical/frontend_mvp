import React from "react";
import "../../styles/components/careMemberCard.css";

export default function CareMemberCard({ image, title, name, phoneNumber }) {
  return (
    <div className="care-member-card">
      <div className="care-left">
        <img src={image} alt={name} className="care-avatar" />
        <div className="care-text">
          <div className="care-title body">{title}</div>
          <div className="care-name caption">{name}</div>
        </div>
      </div>
      <a href={`tel:${phoneNumber}`} className="call-icon">
        <span className="material-symbols-rounded">call</span>
      </a>
    </div>
  );
}
