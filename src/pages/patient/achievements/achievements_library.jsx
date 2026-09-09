import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { achievementsAPI } from "../../../utils/api";
import BackButton from "../../../components/ui/backButton";
const AchievementsLibrary = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language === "zh" ? "zh" : "en";
  const [badges, setBadges] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);

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

  // Fetch achievements from backend
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await achievementsAPI.getMyAchievements();
        if (data.success) {
          setAchievementsData(data.achievements || []);
        }
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      }
    };
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // Load badge images and merge with backend unlock state
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const unlockedImages = import.meta.glob(
          "../../assets/images/achievements/badges/unlocked/*.{png,jpg,jpeg,svg}"
        );
        const lockedImages = import.meta.glob(
          "../../assets/images/achievements/badges/locked/*.{png,jpg,jpeg,svg}"
        );

        const badgeMap = {};

        for (const path in unlockedImages) {
          const module = await unlockedImages[path]();
          const fileName = path.split("/").pop().split(".")[0];
          badgeMap[fileName] = { ...(badgeMap[fileName] || {}), unlockedImage: module.default };
        }

        for (const path in lockedImages) {
          const module = await lockedImages[path]();
          const fileName = path.split("/").pop().split(".")[0];
          badgeMap[fileName] = { ...(badgeMap[fileName] || {}), lockedImage: module.default };
        }

        // Build from backend achievement data, matched with images
        const achievementMap = {};
        achievementsData.forEach((a) => { achievementMap[a.badge_image] = a; });

        const badgeList = Object.entries(badgeMap).map(([fileName, images]) => {
          const achievement = achievementMap[fileName];
          const isUnlocked = achievement ? achievement.unlocked : false;
          return {
            id: fileName,
            image: isUnlocked ? (images.unlockedImage || images.lockedImage) : (images.lockedImage || images.unlockedImage),
            isUnlocked,
            threshold: achievement ? achievement.threshold : Infinity,
            fileName,
            achievement, // pass full backend data for navigation
          };
        });

        // Sort: unlocked first, then by threshold ascending
        badgeList.sort((a, b) => {
          if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1;
          return a.threshold - b.threshold;
        });

        setBadges(badgeList);
      } catch (error) {
        console.error("Error loading badges:", error);
      }
    };

    loadBadges();
  }, [achievementsData]);

  const handleBadgeDetails = (badge) => {
    const variant = badge.isUnlocked ? "unlocked" : "locked";
    navigate(`/badge_details/${variant}`, {
      state: {
        achievement: badge.achievement,
        badgeName: badge.fileName,
      },
    });
  };

  return (
    <div className="achievements-library-container">
      <div className="achievements-library-header">
        <BackButton className="chevron_backward" onClick={() => navigate(-1)} />

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
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="achievement-badge"
              onClick={() => handleBadgeDetails(badge)}
            >
              <div className="badge-image-container">
                <img
                  src={badge.image}
                  alt=""
                  className={`badge-image ${
                    badge.isUnlocked ? "unlocked" : "locked"
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
