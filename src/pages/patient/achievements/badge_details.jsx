import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import { useAuth } from "../../../context/AuthContext";
import { achievementsAPI } from "../../../utils/api";

import Button from "../../../components/ui/button";

// Eagerly load all badge images for dynamic lookup
const unlockedImages = import.meta.glob(
  "../../../assets/images/achievements/badges/unlocked/*.{png,jpg,jpeg,svg}",
  { eager: true }
);
const lockedImages = import.meta.glob(
  "../../../assets/images/achievements/badges/locked/*.{png,jpg,jpeg,svg}",
  { eager: true }
);

const findImage = (name, imageMap) => {
  const key = Object.keys(imageMap).find(k => k.includes(name));
  return key ? imageMap[key].default : null;
};

// Rich descriptions for badge details page (UI-layer display text)
const badgeDetailText = {
  "7daystreak": {
    unlockedDesc: { en: "You're on a roll with 7 days of check-ins in a row!", zh: "您連續7天打卡，表現出色！" },
    lockedDesc: (progress) => ({
      en: `Complete check-ins for 7 days in a row to earn this badge. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續7天完成打卡來獲得此徽章。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "day10": {
    unlockedDesc: { en: "Double digits! 10 days of consistent check-ins!", zh: "雙位數！連續10天打卡！" },
    lockedDesc: (progress) => ({
      en: `Complete check-ins for 10 days in a row. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續10天完成打卡。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "14daystreak": {
    unlockedDesc: { en: "Two weeks strong! You kept a 14-day streak going!", zh: "兩週堅持！您保持了14天的連續記錄！" },
    lockedDesc: (progress) => ({
      en: `Earn this badge by completing check-ins for 14 days in a row. You've checked in for ${progress} consecutive days so far.`,
      zh: `通過連續14天完成打卡來獲得此徽章。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "day20": {
    unlockedDesc: { en: "20 days! Your dedication is inspiring!", zh: "20天！您的毅力令人鼓舞！" },
    lockedDesc: (progress) => ({
      en: `Complete check-ins for 20 days in a row. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續20天完成打卡。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "21daystreak": {
    unlockedDesc: { en: "Three weeks! A new habit is forming!", zh: "三週！新習慣正在養成！" },
    lockedDesc: (progress) => ({
      en: `Complete check-ins for 21 days in a row. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續21天完成打卡。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "25logs": {
    unlockedDesc: { en: "Welcome to the 25 Day Club! Incredible commitment!", zh: "歡迎加入25天俱樂部！令人難以置信的承諾！" },
    lockedDesc: (progress) => ({
      en: `Log for 25 days in a row to join the club. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續記錄25天以加入俱樂部。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "30daystreak": {
    unlockedDesc: { en: "A full month! You've mastered the habit!", zh: "整整一個月！您已經掌握了這個習慣！" },
    lockedDesc: (progress) => ({
      en: `Complete check-ins for 30 days in a row. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續30天完成打卡。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
  "50logs": {
    unlockedDesc: { en: "50 days! You're a health tracking legend!", zh: "50天！您是健康追踪的傳奇！" },
    lockedDesc: (progress) => ({
      en: `Log for 50 days in a row to become a legend. You've checked in for ${progress} consecutive days so far.`,
      zh: `連續記錄50天以成為傳奇。到目前為止，您已經連續打卡${progress}天。`,
    }),
  },
};

const BadgeDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language === "zh" ? "zh" : "en";
  const shareContentRef = useRef(null);
  const { variant = "unlocked" } = useParams();

  // Achievement data from navigation state (passed by achievements_library)
  const badgeState = location.state || {};
  const [achievement, setAchievement] = useState(badgeState.achievement || null);
  const badgeName = badgeState.badgeName || null;

  // Fallback: fetch from API if no navigation state (direct URL access)
  useEffect(() => {
    if (!achievement && user && badgeName) {
      const fetchAchievement = async () => {
        try {
          const data = await achievementsAPI.getMyAchievements();
          if (data.success) {
            const found = (data.achievements || []).find(
              (a) => a.badge_image === badgeName || a.id === badgeName
            );
            if (found) setAchievement(found);
          }
        } catch (err) {
          console.error("Failed to fetch achievement:", err);
        }
      };
      fetchAchievement();
    }
  }, [achievement, user, badgeName]);

  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj?.[currentLang] || textObj?.en || "";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(i18n.language === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Build display data from backend achievement + rich detail text
  const isUnlocked = variant === "unlocked";
  const detailText = badgeName ? badgeDetailText[badgeName] : null;
  const progress = achievement?.progress || 0;

  const currentBadge = {
    image: badgeName
      ? (findImage(badgeName, isUnlocked ? unlockedImages : lockedImages)
        || findImage(badgeName, isUnlocked ? lockedImages : unlockedImages))
      : null,
    name: achievement?.title || { en: "Badge", zh: "徽章" },
    description: detailText
      ? (isUnlocked ? detailText.unlockedDesc : detailText.lockedDesc(progress))
      : (achievement?.description || { en: "", zh: "" }),
    showCongrats: isUnlocked,
    showDate: isUnlocked && !!achievement?.unlocked_at,
    showShare: isUnlocked,
    unlockedAt: achievement?.unlocked_at,
  };

  const handleShare = async () => {
    try {
      const canvas = await html2canvas(shareContentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], "badge-achievement.png", {
          type: "image/png",
        });

        const shareData = {
          title: t("badge_unlocked"),
          text: `I just unlocked the ${getLocalizedText(currentBadge.name)} badge!`,
          files: [file],
        };

        try {
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "badge-achievement.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert("Badge image downloaded!");
          }
        } catch (error) {
          console.error("Error sharing image:", error);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "badge-achievement.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          alert("Badge image downloaded!");
        }
      }, "image/png");
    } catch (error) {
      console.error("Error creating image:", error);
      alert("Unable to create image. Please try again.");
    }
  };

  return (
    <div className="badge-details-container">
      <div className="badge-details-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>

        <div className="badge-details-header h4"></div>
        <span className="material-symbols-rounded file_save"></span>
      </div>

      <div className="badge-details-content">
        <div className="badge-details-info" ref={shareContentRef}>
          {currentBadge.showCongrats && (
            <h3 className="badge-details-congrats h4">
              {t("congratulations")}
            </h3>
          )}
          {variant === "unlocked" && (
            <h2 className="badge-details-unlocked h2">{t("badge_unlocked")}</h2>
          )}

          <div className="badge-details-image">
            <img src={currentBadge.image} alt="Badge" />
          </div>

          <h2 className="badge-details-name h2">
            {getLocalizedText(currentBadge.name)}
          </h2>
          <p className="badge-details-description body">
            {getLocalizedText(currentBadge.description)}
          </p>

          {currentBadge.showDate && (
            <div className="badge-details-date">
              <span className="material-symbols-rounded event">event</span>
              <p className="badge-details-date-text body">
                {t("unlocked_on", { date: formatDate(currentBadge.unlockedAt) })}
              </p>
            </div>
          )}
        </div>

        {currentBadge.showShare && (
          <div className="badge-details-buttonwrap">
            <Button
              variant="filled"
              iconName="share"
              iconPosition="right"
              iconFill={1}
              className="assessment-button body"
              onClick={handleShare}
            >
              {t("share")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeDetails;
