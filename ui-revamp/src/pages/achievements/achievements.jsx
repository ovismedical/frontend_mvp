import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LockedBadgeModal from "../../components/ui/lockedBadgeModal";

import rankIcon from "../../assets/images/achievements/ranks/wellness_warrior.png";

import badge01 from "../../assets/images/achievements/badges/01.png";
import badge02 from "../../assets/images/achievements/badges/02.png";
import badge03 from "../../assets/images/achievements/badges/03.png";
import badge04 from "../../assets/images/achievements/badges/04.png";
import badge05 from "../../assets/images/achievements/badges/05.png";
import badge06 from "../../assets/images/achievements/badges/06.png";
import badge07 from "../../assets/images/achievements/badges/07.png";
import badge08 from "../../assets/images/achievements/badges/08.png";

import DayStreakLocked14 from "../../assets/images/achievements/badges/14DayStreakLocked.png";
import DayStreakLocked21 from "../../assets/images/achievements/badges/21DayStreakLocked.png";
import DayClubLocked25 from "../../assets/images/achievements/badges/25DayClubLocked.png";

const Achievements = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "zh" ? "zh" : "en";
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const [showLockedModal, setShowLockedModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      monthsAgo: { en: "個月前", zh: "個月前" },
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

  // Rank data with multilingual content
  const rankData = {
    title: {
      en: "Wellness Warrior",
      zh: "健康戰士",
    },
    motto: {
      en: "You're building powerful habits.",
      zh: "您正在建立強大的習慣。",
    },
    progressText: {
      en: "Progress to Mindful Maven: 2,450 / 3,000 XP",
      zh: "邁向專注大師：2,450 / 3,000 經驗值",
    },
  };

  // Achievements data with multilingual content
  const achievementsData = [
    {
      type: "streak",
      title: {
        en: "7-day streak",
        zh: "7天連續",
      },
      summary: {
        en: "Logged symptoms daily",
        zh: "每日記錄症狀",
      },
      timestamp: "2025-08-17T10:30:45Z",
    },
    {
      type: "milestone",
      title: {
        en: "First Week Complete",
        zh: "第一週完成",
      },
      summary: {
        en: "Completed your first week of tracking",
        zh: "完成您的第一週追踪",
      },
      timestamp: "2025-08-16T14:20:30Z",
    },
    {
      type: "consistency",
      title: {
        en: "Morning Routine Master",
        zh: "晨間例行大師",
      },
      summary: {
        en: "Logged morning symptoms 5 days in a row",
        zh: "連續5天記錄晨間症狀",
      },
      timestamp: "2025-08-15T08:15:22Z",
    },
    {
      type: "goal",
      title: {
        en: "Hydration Hero",
        zh: "水分英雄",
      },
      summary: {
        en: "Met daily water intake goal",
        zh: "達到每日水分攝取目標",
      },
      timestamp: "2025-08-14T16:45:18Z",
    },
    {
      type: "habit",
      title: {
        en: "Medication Consistency",
        zh: "用藥一致性",
      },
      summary: {
        en: "Took medications on time for 3 days",
        zh: "連續3天按時服藥",
      },
      timestamp: "2025-08-10T09:30:12Z",
    },
  ];

  const recentAchievements = achievementsData
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  // Milestones data with multilingual content
  const milestonesData = [
    {
      title: {
        en: "14 day streak",
        zh: "14天連續",
      },
      summary: {
        en: "Reach 14 day streak to unlock",
        zh: "達到14天連續以解鎖",
      },
      img: DayStreakLocked14,
      progress: 10,
      total: 14,
    },
    {
      title: {
        en: "21 day streak",
        zh: "21天連續",
      },
      summary: {
        en: "Reach 21 day streak to unlock",
        zh: "達到21天連續以解鎖",
      },
      img: DayStreakLocked21,
      progress: 10,
      total: 21,
    },
    {
      title: {
        en: "25 day club",
        zh: "25天俱樂部",
      },
      summary: {
        en: "Log for 25 days to unlock.",
        zh: "記錄25天以解鎖。",
      },
      img: DayClubLocked25,
      progress: 20,
      total: 25,
    },
  ];

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
                style={{ width: "75%" }}
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
                      {getLocalizedText(achievement.summary)}
                    </p>
                  </div>
                </div>
                <p
                  className={`achievements-recent-achievements-date caption ${getColorByType(
                    achievement.type
                  )}`}
                >
                  {formatRelativeDate(achievement.timestamp)}
                </p>
              </div>
            ))}
          </div>
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
                <div key={index} className="achievements-milestones-card">
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
                          stroke="var(--blue-700)"
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
