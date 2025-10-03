import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AchievementsLibrary = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "zh" ? "zh" : "en";
  const [achievements, setAchievements] = useState([]);

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj[currentLang] || textObj.en;
  };

  // Page content with multilingual data
  const pageContent = {
    title: {
      en: "Build Better Habits",
      zh: "建立更好的習慣",
    },
    subtitle: {
      en: "Unlock badges by showing up daily, tracking your health, and committing to your care—step by step.",
      zh: "通過每日出現、追踪健康和致力於護理來解鎖徽章——一步一步來。",
    },
  };

  // Backend Handling: Fetch achievements and badge images from backend
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        // Import all unlocked and locked badge images
        const unlockedImages = import.meta.glob(
          "../../assets/images/achievements/badges/unlocked/*.{png,jpg,jpeg,svg}"
        );
        const lockedImages = import.meta.glob(
          "../../assets/images/achievements/badges/locked/*.{png,jpg,jpeg,svg}"
        );

        const achievementsList = [];

        // Process unlocked images first
        for (const path in unlockedImages) {
          const module = await unlockedImages[path]();
          const fileName = path.split("/").pop().split(".")[0];

          achievementsList.push({
            id: `unlocked-${fileName}`,
            image: module.default,
            isUnlocked: true,
          });
        }

        // Process locked images second
        for (const path in lockedImages) {
          const module = await lockedImages[path]();
          const fileName = path.split("/").pop().split(".")[0];

          achievementsList.push({
            id: `locked-${fileName}`,
            image: module.default,
            isUnlocked: false,
          });
        }

        setAchievements(achievementsList);
      } catch (error) {
        console.error("Error loading achievements:", error);
      }
    };

    loadAchievements();
  }, []);

  const handleBadgeDetails = (achievement) => {
  // Backend Handling: Fetch badge details from backend
  const variant = achievement.isUnlocked ? "unlocked" : "locked";
  navigate(`/badge_details/${variant}`);
  };

  return (
    <div className="achievements-library-container">
      <div className="achievements-library-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>

        <div className="achievements-header h4"></div>
        <span className="material-symbols-rounded file_save"></span>
      </div>

      <div className="achievements-library-content">
        <h2 className="achievements-library-title h2">
          {getLocalizedText(pageContent.title)}
        </h2>
        <h2 className="achievements-library-subtitle body">
          {getLocalizedText(pageContent.subtitle)}
        </h2>

        <div className="achievements-library-grid">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="achievement-badge"
              onClick={() => handleBadgeDetails(achievement)}
            >
              <div className="badge-image-container">
                <img
                  src={achievement.image}
                  alt=""
                  className={`badge-image ${
                    achievement.isUnlocked ? "unlocked" : "locked"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="achievements-library-footer caption">
          {t("advance_rank_footer")}
        </div>
      </div>
    </div>
  );
};

export default AchievementsLibrary;
