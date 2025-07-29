import React from "react";
import ArticleCard from "../ui/articleCard";
import "../../styles/components/careLibrary.css";

const articleData = [
  {
    title: "5 Easy Meals for Treatment Days",
    imageUrl:
      "https://images.immediate.co.uk/production/volatile/sites/30/2023/03/Quick-healthy-recipes-2cd552a.jpg?quality=90&webp=true&resize=800,726",
    text: "Simple, nourishing recipes designed to ease nausea and fatigue during treatment days.",
    icon: "chef_hat",
    likes: "200K",
    category: "Nutrition",
    readTime: "5 min read",
  },
  {
    title: "Managing Stress with Mindfulness",
    imageUrl:
      "https://www.hindustantimes.com/ht-img/img/2025/07/16/1600x900/mindfulness_1752670397429_1752670397533.jpg",
    text: "Learn how mindfulness practices can support mental health and treatment recovery.",
    icon: "digital_wellbeing",
    likes: "150K",
    category: "Wellness",
    readTime: "4 min read",
  },
  {
    title: "Hydration Tips During Chemotherapy",
    imageUrl: "https://www.bldgactive.com/wp-content/uploads/2023/12/3-11.jpg",
    text: "Discover simple ways to stay hydrated and why it’s essential during chemo.",
    icon: "water_drop",
    likes: "120K",
    category: "Health",
    readTime: "3 min read",
  },
];

const CareLibrary = () => {
  return (
    <div className="care-library-container">
      <div className="care-library-header">
        <h2 className="care-library-header-title h4">Your Care Library</h2>
        <a href="#" className="view-all caption">
          View All
        </a>
      </div>
      <div className="article-scroll-container">
        {articleData.map((article, index) => (
          <ArticleCard key={index} {...article} />
        ))}
      </div>
    </div>
  );
};

export default CareLibrary;
