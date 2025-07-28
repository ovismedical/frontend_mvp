import React from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/userHeader.css";

const UserHeader = () => {
  const { user } = useAuth();

  const currentDateTime = () => {
    const now = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    const datePart = now.toLocaleDateString("en-US", options);
    const timePart = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  };

  return (
    <div className="user-header" data-scale="large">
      <div className="user-header__text h4">
        <div className="greeting">
          Good Morning, <span className="username">{user?.name || "User"}</span>
        </div>
        <div className="datetime caption">{currentDateTime()}</div>
      </div>
      <button className="bell-button" aria-label="Notifications">
        <span className="material-symbols-rounded notify">notifications</span>
      </button>
    </div>
  );
};

export default UserHeader;
