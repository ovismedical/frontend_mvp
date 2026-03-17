import React from "react";
import "../../styles/components/userCard.css";
import { useNavigate } from "react-router-dom";

const UserCard = ({
  userImage,
  userName,
  condition,
  status = "active-treatment",
  alt = "Profile",
  onProfileManagement,
  onQRCodeClick,
}) => {
  // Status configuration with appropriate icons and colors
  const statusConfig = {
    "active-treatment": {
      text: "Active Treatment",
      icon: "timeline",
      colorClass: "status-active",
    },
    "in-remission": {
      text: "In Remission",
      icon: "task_alt",
      colorClass: "status-remission",
    },
    "post-treatment": {
      text: "Post Treatment",
      icon: "workspace_premium",
      colorClass: "status-post",
    },
    monitoring: {
      text: "Monitoring",
      icon: "monitor_heart",
      colorClass: "status-monitoring",
    },
    consultation: {
      text: "Consultation",
      icon: "diversity_3",
      colorClass: "status-consultation",
    },
    recovery: {
      text: "Recovery",
      icon: "self_improvement",
      colorClass: "status-recovery",
    },
  };

  const currentStatus =
    statusConfig[status] || statusConfig["active-treatment"];

  const navigate = useNavigate();

  const handleProfileManagement = (e) => {
    e.preventDefault();
    if (onProfileManagement) {
      onProfileManagement(e);
    } else {
      // Fallback to default behavior if no prop is passed
      navigate("/profile_management");
    }
  };

  return (
    <div className="user-card">
      <div className="user-left">
        <img src={userImage} alt={alt} className="user-image" />
        <div className="user-info">
          <h3 className="user-name h4">{userName}</h3>
          <p className="user-condition body">{condition}</p>
          <p className={`user-status ${currentStatus.colorClass}`}>
            <span className="material-symbols-rounded status-icon">
              {currentStatus.icon}
            </span>
            <span className="status-text caption">{currentStatus.text}</span>
          </p>
        </div>
      </div>
      <div className="user-right">
        <span className="material-symbols-rounded" onClick={onQRCodeClick}>
          qr_code
        </span>
        <span
          className="material-symbols-rounded"
          onClick={handleProfileManagement}
        >
          person_edit
        </span>
      </div>
    </div>
  );
};

export default UserCard;
