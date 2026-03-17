import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/articleCard.css";

const ArticleCard = ({
  title,
  imageUrl,
  text,
  icon,
  likes,
  category,
  readTime,
  variant = "mid",
  articleId,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (articleId) {
      navigate(`/articles_details`, { state: { articleId } });
    }
  };
  const isLarge = variant === "large";
  const isSmall = variant === "small";
  const isMid = variant === "mid";

  return (
    <div
      className={`article-card ${
        isLarge ? "article-card-large" : isSmall ? "article-card-small" : ""
      }`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {isSmall ? (
        <div className="article-card-small-layout">
          <div className="article-image-container-small">
            <img src={imageUrl} alt={title} className="article-image-small" />
          </div>
          <div className="article-card-small-text">
            <h2 className="article-card-title h4">{title}</h2>
            <div className="article-card-subtitle">
              <div className="article-meta caption">
                <span>{readTime}</span>
              </div>
            </div>
            <div className="article-card-description">
              <p>{text}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="article-card-header">
            <h2 className="article-card-title h4">{title}</h2>
            <div className="article-card-subtitle">
              {icon && (
                <span className="material-symbols-rounded article-sub-icon">
                  {icon}
                </span>
              )}
              <div className="article-meta caption">
                <span>{category}</span>
                {isMid && (
                  <>
                    {" - "}
                    <span>{readTime}</span>
                  </>
                )}
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
            <div className="article-footer">
              {isLarge && (
                <div className="article-read-time">
                  <span className="caption">{readTime}</span>
                </div>
              )}
              <div className="article-likes">
                <span className="material-symbols-rounded favorite-icon">
                  favorite
                </span>
                <span className="like-count caption">{likes}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleCard;
