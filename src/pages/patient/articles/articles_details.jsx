import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "../../../components/ui/tabs";
import Button from "../../../components/ui/button.jsx";
import articlesData from "../../../fixtures/articles.json";
import usersData from "../../../fixtures/users.json";
import CommentCard from "../../../components/ui/commentCard.jsx";
import ArticleCard from "../../../components/ui/articleCard.jsx";
import BackButton from "../../../components/ui/backButton";
export default function ArticleDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [allowScroll, setAllowScroll] = useState(false);
  const articleTextRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Article");
  const [article, setArticle] = useState(null);
  const [commentText, setCommentText] = useState("");
  // Add touch tracking state
  const [touchStart, setTouchStart] = useState(null);

  const tabs = [{ name: "Article" }, { name: "Comments" }, { name: "Similar" }];

  useEffect(() => {
    const articleId = location.state?.articleId;
    if (articleId) {
      // Find the article across all categories
      let foundArticle = null;
      let foundCategory = null;

      Object.keys(articlesData).forEach((category) => {
        const categoryArticle = articlesData[category].articles.find(
          (a) => a.id === articleId
        );
        if (categoryArticle) {
          foundArticle = {
            ...categoryArticle,
            category: category,
            categoryIcon: articlesData[category].icon,
          };
          foundCategory = category;
        }
      });

      setArticle(foundArticle);
      // Reset active tab to "Article" when a new article is loaded
      setActiveTab("Article");
    }
  }, [location.state]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleWheel = (e) => {
    const scrollHeight = articleTextRef.current?.scrollHeight || 0;
    const clientHeight = articleTextRef.current?.clientHeight || 0;

    if (scrollHeight <= clientHeight) {
      return;
    }

    if (!allowScroll && e.deltaY > 0) {
      e.preventDefault();
      setIsScrolled(true);
      setTimeout(() => setAllowScroll(true), 300);
    }
  };

  // Add touch event handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const scrollHeight = articleTextRef.current?.scrollHeight || 0;
    const clientHeight = articleTextRef.current?.clientHeight || 0;

    if (scrollHeight <= clientHeight) {
      return;
    }

    const currentTouch = e.touches[0].clientY;
    const diff = touchStart - currentTouch;

    // If scrolling down and scroll is not allowed yet
    if (!allowScroll && diff > 20) {
      e.preventDefault();
      setIsScrolled(true);
      setTimeout(() => setAllowScroll(true), 300);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleScroll = () => {
    if (allowScroll && articleTextRef.current) {
      const scrollTop = articleTextRef.current.scrollTop;
      if (scrollTop === 0) {
        setIsScrolled(false);
        setAllowScroll(false);
      }
    }
  };

  const formatLikes = (likes) => {
    if (likes >= 1000000) {
      return `${(likes / 1000000).toFixed(1)}M`;
    } else if (likes >= 1000) {
      return `${Math.floor(likes / 1000)}K`;
    }
    return likes.toString();
  };

  const renderContent = (contentArray) => {
    return contentArray.map((item, index) => {
      switch (item.type) {
        case "h3":
          return (
            <h3 key={index} className="h4">
              {item.text}
            </h3>
          );
        case "p":
          return (
            <p key={index} className="body">
              {item.text}
            </p>
          );
        case "img":
          return (
            <img
              key={index}
              className="content-img"
              src={item.src}
              alt={item.alt}
            />
          );
        default:
          return null;
      }
    });
  };

  // Helper function to get user by ID
  const getUserById = (userId) => {
    return usersData.find((user) => user.userId === userId);
  };

  // Helper function to format name (shorten last name to initial)
  const formatUserName = (fullName) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`;
    }
    return fullName;
  };

  // Helper function to get initials for avatar
  const getUserInitials = (fullName) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const handleCommentSubmit = () => {
    // Backend Handling: Post new comment to backend
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  if (!article) {
    return (
      <div className="article-details">
        <div className="article-content">
          <p className="body">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-details">
      <div className="article-image">
        <img src={article.imageUrl} alt={article.title} />
        <BackButton className="article-back-btn" onClick={() => navigate("/articles")} />

        <div className="article-basic-info">
          <div className="article-category-container">
            <span className="material-symbols-rounded article-category-icon">
              {article.categoryIcon}
            </span>
            <p className="article-category caption">{article.category}</p>
          </div>
          <h1 className="article-title display">{article.title}</h1>
          <p className="article-readTime body">
            {article.readTimeMinutes} min read
          </p>
        </div>
      </div>

      <div
        className={`article-content ${isScrolled ? "scrolled" : ""}`}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="article-content-tabs">
          <Tabs
            tabs={tabs}
            onTabChange={handleTabChange}
            activeTab={activeTab}
          />
        </div>

        <div
          className="article-content-wrapper"
          ref={articleTextRef}
          onScroll={handleScroll}
          style={{
            overflowY: allowScroll ? "auto" : "hidden",
          }}
        >
          {activeTab === "Article" && (
            <div className="article-content-text">
              {article.content && renderContent(article.content)}
              <Button variant="filled" className="article-button body-semibold">
                Done? Collect Your XP
              </Button>
            </div>
          )}

          {activeTab === "Comments" && (
            <div className="article-comments-container">
              <div className="comment-input-container">
                <textarea
                  className="comment-input caption"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />
                <Button
                  variant="filled"
                  className="comment-submit-btn body-semibold"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </div>

              {article.comments && article.comments.length > 0 ? (
                article.comments
                  // Sort comments by timestamp (newest first)
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((comment, index) => {
                    const user = getUserById(comment.userId);
                    const userName = user
                      ? formatUserName(user.fullName)
                      : "Unknown User";
                    const userImg = user?.profileImg || "";
                    const initials = user
                      ? getUserInitials(user.fullName)
                      : "U";
                    const timeAgo = formatTimeAgo(comment.timestamp);

                    return (
                      <CommentCard
                        key={index}
                        profileImg={userImg}
                        name={userName}
                        timeAgo={timeAgo}
                        comment={comment.text}
                        initials={initials}
                      />
                    );
                  })
              ) : (
                <p className="body">No comments yet</p>
              )}
            </div>
          )}

          {activeTab === "Similar" && (
            <div className="similar-articles-container">
              {article && article.category && articlesData[article.category] ? (
                (() => {
                  // Get all articles from the same category except the current one
                  const similarArticles = articlesData[
                    article.category
                  ].articles
                    .filter((a) => a.id !== article.id)
                    .slice(0, 10); // Limit to max 10 articles

                  return similarArticles.length > 0 ? (
                    similarArticles.map((similarArticle) => (
                      <ArticleCard
                        key={similarArticle.id}
                        title={similarArticle.title}
                        imageUrl={similarArticle.imageUrl}
                        text={similarArticle.description}
                        readTime={`${similarArticle.readTimeMinutes} min read`}
                        likes={similarArticle.likes}
                        variant="small"
                        articleId={similarArticle.id}
                      />
                    ))
                  ) : (
                    <p className="body">No similar articles found</p>
                  );
                })()
              ) : (
                <p className="body">No similar articles available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
