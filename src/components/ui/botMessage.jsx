import React from "react";
import BotAvatar from "../../assets/images/bot_avatar.png";
import "../../styles/components/botMessage.css";

export default function BotMessage({ text, time }) {
  return (
    <div className="bot-row">
      <div className="bot-avatar">
        <img src={BotAvatar} alt="Bot Avatar" />
      </div>
      <div className="bot-content">
        <div className="bot-message">
          <div className="message-text body">{text}</div>
        </div>
        <div className="bot-message-time overline-timestamp">{time}</div>
      </div>
    </div>
  );
};
