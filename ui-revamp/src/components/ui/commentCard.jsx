import React, { useState } from "react";
import "../../styles/components/commentCard.css";

export default function CommentCard({
  profileImg,
  name,
  timeAgo,
  comment,
  initials,
}) {
  return (
    <div className="comment-card">
      <div className="comment-content">
        <div className="comment-header">
          {profileImg ? (
            <img src={profileImg} alt={name} className="comment-avatar" />
          ) : (
            <div className="comment-avatar comment-avatar-initials">
              {initials}
            </div>
          )}
          <div className="comment-name-time">
            <span className="comment-name caption-semibold">{name}</span>
            <span className="comment-time caption">{timeAgo}</span>
          </div>
        </div>
        <p className="comment-text body">{comment}</p>
      </div>
    </div>
  );
}
