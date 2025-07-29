import React from "react";
import "../../styles/components/articleCard.css";

const ArticleCard = ({
  title,
  imageUrl,
  text,
  icon,
  likes,
  category,
  readTime,
}) => {
  return (
    <div className="article-card">
      <div className="article-card-header">
        <h2 className="article-card-title h4">{title}</h2>
        <div className="article-card-subtitle">
          {icon && (
            <span className="material-symbols-rounded article-sub-icon">
              {icon}
            </span>
          )}
          <div className="article-meta caption">
            <span>{category}</span> - <span>{readTime}</span>
          </div>
        </div>
        <div className="article-card-description">
          <p>{text}</p>
        </div>
      </div>

      <div className="article-card-content">
        <div className="article-image-container">
          <img src={imageUrl} alt={title} className="article-image" />
          <div className="article-overlay" />
        </div>
        <div className="article-likes">
          <span className="material-symbols-rounded favorite-icon">
            favorite
          </span>
          <span className="like-count caption">{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
