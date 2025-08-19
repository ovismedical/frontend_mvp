import React, { useState } from "react";
import NotificationCard from "../ui/notificationCard.jsx";
import "../../styles/components/homeNotifications.css";

const HomeNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Message From Dr. Lee",
      message: "Your recent report flagged an issue — check details.",
      icon: "error",
      type: "error",
    },
    {
      id: 2,
      title: "Reminder",
      message: "Don’t forget your appointment tomorrow.",
      icon: "event",
      type: "info",
    },
    {
      id: 3,
      title: "System Alert",
      message: "Backup failed due to low storage.",
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
          + {notifications.length - 1} more
        </div>
      )}
    </div>
  );
};

export default HomeNotifications;
