import React from "react";
import ArticleCard from "../ui/articleCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/components/careLibrary.css";

// Backend Handling: Fetch articles from backend
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
  {
    title: "Gentle Workouts to Boost Energy",
    imageUrl:
      "https://i.pinimg.com/736x/5b/d1/55/5bd155cb02cd30ae940cb17737ae0e78.jpg",
    text: "Light exercise routines to help you stay active and reduce fatigue.",
    icon: "fitness_center",
    likes: "90K",
    category: "Exercise",
    readTime: "6 min read",
  },
  {
    title: "Navigating Hair Loss with Confidence",
    imageUrl:
      "https://regenerationmedicalspa.com/wp-content/uploads/2024/02/4-2-1024x576.jpg",
    text: "Practical tips and emotional support for dealing with hair loss during treatment.",
    icon: "face_retouching_natural",
    likes: "170K",
    category: "Support",
    readTime: "4 min read",
  },
  {
    title: "Creating a Sleep Routine that Works",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwZ_wcbWSrCVg4Dt13jUUM027aL_5zFOLPTQ&s",
    text: "Improve your sleep quality with these science-backed bedtime habits.",
    icon: "bedtime",
    likes: "110K",
    category: "Wellness",
    readTime: "5 min read",
  },
  {
    title: "Snack Ideas for Nausea Relief",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShok_9Uw7EBkbrbuuXmGqJU6q-FEvPCIeRNQ&s",
    text: "Try these easy, stomach-friendly snacks to help calm nausea.",
    icon: "restaurant",
    likes: "87K",
    category: "Nutrition",
    readTime: "3 min read",
  },
  {
    title: "Coping with Emotional Ups and Downs",
    imageUrl:
      "https://bellabeat.com/wp-content/uploads/2024/01/women-mood-swings-causes.jpg",
    text: "Tips to manage mood swings and emotional fatigue during treatment.",
    icon: "psychology",
    likes: "130K",
    category: "Mental Health",
    readTime: "4 min read",
  },
];

const CareLibrary = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate("/articles");
  };

  return (
    <div className="care-library-container">
      <div className="care-library-header">
        <h2 className="care-library-header-title h4">{t("your_care_library")}</h2>
        <a href="#" className="view-all caption" onClick={handleViewAll}>
          {t("view_all")}
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
