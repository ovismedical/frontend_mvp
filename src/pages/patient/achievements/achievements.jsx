import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LockedBadgeModal from "../../../components/ui/lockedBadgeModal";
import { useAuth } from "../../../context/AuthContext";
import { achievementsAPI } from "../../../utils/api";

import rankIcon from "../../../assets/images/achievements/ranks/wellness_warrior.png";

import badge01 from "../../../assets/images/achievements/badges/01.png";
import badge02 from "../../../assets/images/achievements/badges/02.png";
import badge03 from "../../../assets/images/achievements/badges/03.png";
import badge04 from "../../../assets/images/achievements/badges/04.png";
import badge05 from "../../../assets/images/achievements/badges/05.png";
import badge06 from "../../../assets/images/achievements/badges/06.png";
import badge07 from "../../../assets/images/achievements/badges/07.png";
import badge08 from "../../../assets/images/achievements/badges/08.png";

import DayStreakLocked14 from "../../../assets/images/achievements/badges/14DayStreakLocked.png";
import DayStreakLocked21 from "../../../assets/images/achievements/badges/21DayStreakLocked.png";
import DayClubLocked25 from "../../../assets/images/achievements/badges/25DayClubLocked.png";

// Milestone IDs that appear in the milestones section (must match backend ACHIEVEMENT_DEFINITIONS)
const MILESTONE_IDS = ["14daystreak", "21daystreak", "25logs"];
const MILESTONE_IMAGES = {
  "14daystreak": DayStreakLocked14,
  "21daystreak": DayStreakLocked21,
  "25logs": DayClubLocked25,
};

const Achievements = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "zh" ? "zh" : "en";
  const { user } = useAuth();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await achievementsAPI.getMyAchievements();
        if (data.success) {
          setAchievements(data.achievements || []);
          setStreak({ current: data.current_streak || 0, longest: data.longest_streak || 0 });
        }
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      }
    };
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj[currentLang] || textObj.en;
  };

  const handleSeeAll = (e) => {
    e.preventDefault();
    navigate("/achievements_library");
  };

  const badgeImages = [
    badge01,
    badge02,
    badge03,
    badge04,
    badge05,
    badge06,
    badge07,
    badge08,
  ];

  const getIconByType = (type) => {
    const iconMap = {
      streak: "event_available",
      milestone: "star",
      consistency: "trending_up",
      goal: "flag",
      habit: "repeat",
      wellness: "favorite",
      tracking: "timeline",
    };
    return iconMap[type] || "achievement";
  };

  const getColorByType = (type) => {
    const colorMap = {
      streak: "blue",
      milestone: "secondary",
      consistency: "lavender",
      goal: "blue",
      habit: "secondary",
      wellness: "lavender",
      tracking: "blue",
    };
    return colorMap[type] || "blue";
  };

  const formatRelativeDate = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const achievementDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffInMs = nowDate - achievementDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const dateStrings = {
      today: { en: "Today", zh: "今天" },
      yesterday: { en: "Yesterday", zh: "昨天" },
      daysAgo: { en: "days ago", zh: "天前" },
      weekAgo: { en: "1 week ago", zh: "1週前" },
      weeksAgo: { en: "weeks ago", zh: "週前" },
      monthAgo: { en: "1 month ago", zh: "1個月前" },
      monthsAgo: { en: "months ago", zh: "個月前" },
      yearAgo: { en: "1 year ago", zh: "1年前" },
      yearsAgo: { en: "years ago", zh: "年前" },
    };

    if (diffInDays === 0) {
      return getLocalizedText(dateStrings.today);
    } else if (diffInDays === 1) {
      return getLocalizedText(dateStrings.yesterday);
    } else if (diffInDays <= 7) {
      return `${diffInDays} ${getLocalizedText(dateStrings.daysAgo)}`;
    } else if (diffInDays <= 28) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1
        ? getLocalizedText(dateStrings.weekAgo)
        : `${weeks} ${getLocalizedText(dateStrings.weeksAgo)}`;
    } else if (diffInDays <= 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1
        ? getLocalizedText(dateStrings.monthAgo)
        : `${months} ${getLocalizedText(dateStrings.monthsAgo)}`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1
        ? getLocalizedText(dateStrings.yearAgo)
        : `${years} ${getLocalizedText(dateStrings.yearsAgo)}`;
    }
  };

  // Rank block driven by the real streak: next locked badge and how far along it is
  const nextBadge = [...achievements].filter((a) => !a.unlocked).sort((a, b) => a.total - b.total)[0] || null;
  const rankProgress = nextBadge ? Math.min(100, Math.round((nextBadge.progress / nextBadge.total) * 100)) : 100;
  const rankData = {
    title: { en: "Wellness Warrior", zh: "健康戰士" },
    motto: {
      en: t("streak_summary", { current: streak.current, longest: streak.longest }),
      zh: t("streak_summary", { current: streak.current, longest: streak.longest }),
    },
    progressText: nextBadge
      ? { en: t("next_badge_progress", { title: nextBadge.title.en, progress: nextBadge.progress, total: nextBadge.total }),
          zh: t("next_badge_progress", { title: nextBadge.title.zh, progress: nextBadge.progress, total: nextBadge.total }) }
      : { en: t("all_badges_unlocked"), zh: t("all_badges_unlocked") },
  };

  // Derive recent achievements from backend data (unlocked ones, most recent first)
  const recentAchievements = achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => new Date(b.unlocked_at) - new Date(a.unlocked_at))
    .slice(0, 3);

  // Derive milestones from backend data (14, 21, 25 day)
  const milestonesData = MILESTONE_IDS.map((id) => {
    const achievement = achievements.find((a) => a.id === id);
    if (!achievement) return null;
    return {
      ...achievement,
      img: MILESTONE_IMAGES[id],
      completed: achievement.unlocked,
      summary: achievement.unlocked
        ? { en: "Milestone achieved!", zh: "里程碑已達成！" }
        : achievement.description,
    };
  }).filter(Boolean);

  const getCircularProgressProps = (isLarge) => {
    if (isLarge) {
      return {
        size: 100,
        viewBox: "0 0 100 100",
        radius: 40,
        center: 50,
        strokeDasharray: 2 * Math.PI * 40,
      };
    }
    return {
      size: 70,
      viewBox: "0 0 70 70",
      radius: 30,
      center: 35,
      strokeDasharray: 2 * Math.PI * 30,
    };
  };

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        ></span>

        <div className="achievements-header h4">{t("achievements")}</div>
        <span className="material-symbols-rounded file_save"></span>
      </div>

      <div className="achievements-content">
        <div className="achievements-summary">
          <div className="achievements-rank-icon">
            <img src={rankIcon} alt="Rank Icon" />
          </div>
          <h4 className="achievements-rank-title h4">
            {getLocalizedText(rankData.title)}
          </h4>
          <p className="achievements-rank-motto body">
            {getLocalizedText(rankData.motto)}
          </p>
          <div className="achievements-rank-progress">
            <div className="achievements-progress-bar">
              <div
                className="achievements-progress-fill"
                style={{ width: `${rankProgress}%` }}
              ></div>
            </div>
            <span className="achievements-progress-text caption">
              {getLocalizedText(rankData.progressText)}
            </span>
          </div>
        </div>

        <div className="achievements-recent-achievements">
          <h2 className="achievements-section-title h4">
            {t("recent_achievements")}
          </h2>
          {recentAchievements.length === 0 ? (
            <p className="achievements-empty-state body">
              {getLocalizedText({
                en: "Complete daily check-ins to earn achievements!",
                zh: "完成每日打卡以獲得成就！"
              })}
            </p>
          ) : (
            <div className="achievements-cards-container">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`achievements-recent-achievements-card ${getColorByType(
                    achievement.type
                  )}`}
                >
                  <div className="achievements-recent-achievements-left">
                    <span
                      className={`achievements-recent-achievements-icon ${getColorByType(
                        achievement.type
                      )}`}
                    >
                      <span className="material-symbols-rounded recent-achievements-icon">
                        {getIconByType(achievement.type)}
                      </span>
                    </span>
                    <div className="achievements-recent-achievements-text">
                      <h4 className="achievements-recent-achievements-title body">
                        {getLocalizedText(achievement.title)}
                      </h4>
                      <p className="achievements-recent-achievements-summary caption">
                        {getLocalizedText(achievement.description)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`achievements-recent-achievements-date caption ${getColorByType(
                      achievement.type
                    )}`}
                  >
                    {achievement.unlocked_at
                      ? formatRelativeDate(achievement.unlocked_at)
                      : getLocalizedText({ en: "Achieved", zh: "已達成" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="achievements-badge-collection">
          <div className="achievements-badge-header">
            <h2 className="achievements-section-title h4">
              {t("badge_collection")}
            </h2>
            <span
              className="achievements-see-all caption"
              onClick={handleSeeAll}
            >
              {t("see_all")}
            </span>
          </div>
          <div className="badge-collection-container">
            {badgeImages.map((badgeImg, index) => (
              <div key={index} className="badge-item">
                <img
                  src={badgeImg}
                  alt={`Badge ${index + 1}`}
                  className="badge-image"
                  onClick={() => {
                    if (index === 7) {
                      setShowLockedModal(true);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-milestones">
          <div className="achievements-milestones-header">
            <h2 className="achievements-section-title h4">{t("milestones")}</h2>
            <span
              className="achievements-see-all caption"
              onClick={handleSeeAll}
            >
              {t("see_all")}
            </span>
          </div>
          <div className="milestones-container">
            {milestonesData.map((milestone, index) => {
              const props = getCircularProgressProps(isLargeScreen);

              return (
                <div key={index} className={`achievements-milestones-card ${milestone.completed ? "milestone-completed" : ""}`}>
                  <div className="achievements-milestones-left">
                    <div className="achievements-milestone-image">
                      <img
                        src={milestone.img}
                        alt={getLocalizedText(milestone.title)}
                        className="milestone-icon-image"
                      />
                    </div>
                    <div className="achievements-milestones-text">
                      <h4 className="achievements-milestones-title body">
                        {getLocalizedText(milestone.title)}
                      </h4>
                      <p className="achievements-milestones-summary caption">
                        {getLocalizedText(milestone.summary)}
                      </p>
                    </div>
                  </div>
                  <div className="achievements-milestones-progress">
                    <div className="circular-progress">
                      <svg
                        className="progress-ring"
                        width={props.size}
                        height={props.size}
                        viewBox={props.viewBox}
                      >
                        <circle
                          className="progress-ring-circle-bg"
                          stroke="var(--neutral-200)"
                          strokeWidth="4"
                          fill="transparent"
                          r={props.radius}
                          cx={props.center}
                          cy={props.center}
                        />
                        <circle
                          className="progress-ring-circle"
                          stroke={milestone.completed ? "var(--green-700, #15803d)" : "var(--blue-700)"}
                          strokeWidth="4"
                          fill="transparent"
                          r={props.radius}
                          cx={props.center}
                          cy={props.center}
                          strokeDasharray={props.strokeDasharray}
                          strokeDashoffset={
                            props.strokeDasharray *
                            (1 - milestone.progress / milestone.total)
                          }
                          style={{
                            transform: "rotate(-90deg)",
                            transformOrigin: `${props.center}px ${props.center}px`,
                          }}
                        />
                      </svg>
                      <div className="progress-text caption">
                        <span className="progress-number">
                          {milestone.progress}
                        </span>
                        <span className="progress-total">
                          /{milestone.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <LockedBadgeModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
      />
    </div>
  );
};

export default Achievements;
