import React from "react";
import UserAvatar from "../../assets/images/user_avatar.png";
import "../../styles/components/userMessage.css";

export default function UserMessage({ text, time }) {
  return (
    <div className="user-row">
      <div className="user-content">
        <div className="user-message">
          <div className="message-text body">{text}</div>
        </div>
        <div className="user-message-time overline-timestamp">{time}</div>
      </div>
      <div className="user-avatar">
        <img src={UserAvatar} alt="User Avatar" />
      </div>
    </div>
  );
}
