import React from "react";
import "../../styles/components/notificationCard.css";

const NotificationCard = ({
  title,
  message,
  onClose,
  icon = "error",
  type = "error",
}) => {
  const getCardStyle = () => {
    switch (type) {
      case "error":
        return {
          backgroundColor: "var(--error-50)",
          iconColor: "var(--on-error-tint)",
          titleColor: "var(--text-500)",
          messageColor: "var(--text-400)",
        };
      case "warning":
        return {
          backgroundColor: "var(--warning-50)",
          iconColor: "var(--on-warning-tint)",
          titleColor: "var(--text-500)",
          messageColor: "var(--text-400)",
        };
      case "info":
        return {
          backgroundColor: "var(--info-50)",
          iconColor: "var(--on-info-tint)",
          titleColor: "var(--text-500)",
          messageColor: "var(--text-400)",
        };
      case "success":
        return {
          backgroundColor: "var(--success-50)",
          iconColor: "var(--on-success-tint)",
          titleColor: "var(--text-500)",
          messageColor: "var(--text-400)",
        };
      default:
        return {
          backgroundColor: "var(--error-50)",
          iconColor: "var(--on-error-tint)",
          titleColor: "var(--text-500)",
          messageColor: "var(--text-400)",
        };
    }
  };

  const { backgroundColor, iconColor, titleColor, messageColor } =
    getCardStyle();

  return (
    <div className="notification-card" style={{ backgroundColor }}>
      <span
        className="material-symbols-rounded icon"
        style={{ color: iconColor }}
      >
        {icon}
      </span>
      <div className="notification-content">
        <div className="notification-title h4" style={{ color: titleColor }}>
          {title}
        </div>
        <div className="notification-message body" style={{ color: messageColor }}>
          {message}
        </div>
      </div>
      <button className="close-button" onClick={onClose}>
        <span className="material-symbols-rounded ">close</span>
      </button>
    </div>
  );
};

export default NotificationCard;
