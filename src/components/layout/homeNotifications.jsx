import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import NotificationCard from "../ui/notificationCard.jsx";
import "../../styles/components/homeNotifications.css";

const HomeNotifications = () => {
  const { t } = useTranslation();

  // Backend Handling : Fetch notifications from API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: t("notification_message_from_doctor"),
      message: t("notification_report_issue"),
      icon: "error",
      type: "error",
    },
    {
      id: 2,
      title: t("notification_reminder"),
      message: t("notification_appointment_reminder"),
      icon: "event",
      type: "info",
    },
    {
      id: 3,
      title: t("notification_system_alert"),
      message: t("notification_backup_failed"),
      icon: "warning",
      type: "warning",
    },
  ]);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="home-notifications-container">
      {notifications.slice(0, 1).map((note) => (
        <NotificationCard
          key={note.id}
          title={note.title}
          message={note.message}
          icon={note.icon}
          type={note.type}
          onClose={() => handleClose(note.id)}
        />
      ))}
      {notifications.length > 1 && (
        <div className="stacked-count body">
          + {notifications.length - 1} {t("more")}
        </div>
      )}
    </div>
  );
};

export default HomeNotifications;
