import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../../components/ui/tabs";
import articlesData from "../../../data/articles.json";
import ArticleCard from "../../../components/ui/articleCard";

const Article = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const categoryNames = Object.keys(articlesData);
  const [activeTab, setActiveTab] = useState("All");
  const tabs = [
    { name: "All" },
    ...categoryNames.map((category) => ({ name: category })),
  ];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  const getFilteredArticles = () => {
    let allArticles = [];

    if (activeTab === "All") {
      categoryNames.forEach((category) => {
        articlesData[category].articles.forEach((article) => {
          allArticles.push({
            ...article,
            category: category,
            categoryIcon: articlesData[category].icon,
          });
        });
      });
    } else {
      if (articlesData[activeTab]) {
        allArticles = articlesData[activeTab].articles.map((article) => ({
          ...article,
          category: activeTab,
          categoryIcon: articlesData[activeTab].icon,
        }));
      }
    }

    if (searchTerm.trim()) {
      allArticles = allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          article.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allArticles;
  };

  const formatLikes = (likes) => {
    if (likes >= 1000000) {
      return `${(likes / 1000000).toFixed(1)}M`;
    } else if (likes >= 1000) {
      return `${Math.floor(likes / 1000)}K`;
    }
    return likes.toString();
  };

  const filteredArticles = getFilteredArticles();

  return (
    <div className="help-center-container">
      <div className="help-center-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate("/home")}
        >
          chevron_backward
        </span>
        <div className="help-center-header h4">Your Care Library</div>
        <span
          className="material-symbols-rounded search"
          onClick={toggleSearch}
          style={{ cursor: "pointer" }}
        >
          search
        </span>
      </div>

      {isSearchVisible && (
        <div className="help-center-search-input-container">
          <input
            className="body"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="tabs-scrollable-container">
        <Tabs
          tabs={tabs}
          onTabChange={handleTabChange}
          scrollable={true}
          activeTab={activeTab}
        />
      </div>

      <div className="article-list-container">
        {filteredArticles.length === 0 ? (
          <div className="no-articles-message">
            <p className="body">
              {searchTerm
                ? `No articles found matching "${searchTerm}"`
                : "No articles available in this category"}
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              variant="large"
              title={article.title}
              imageUrl={article.imageUrl}
              text={article.description}
              icon={article.categoryIcon}
              likes={formatLikes(article.likes)}
              category={article.category}
              readTime={`${article.readTimeMinutes} min read`}
              articleId={article.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Article;
