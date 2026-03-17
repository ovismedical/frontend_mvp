import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/dailyCheckIn.css";
import WeeklyProgressRow from "../ui/weekly_ProgressRow";
import { useNavigate } from "react-router-dom";

const DailyCheckIn = ({ currentDays = 2, longestDays = 12 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogToday = (e) => {
    e.preventDefault();
    navigate("/chatbot");
  };

  return (
    <div className="daily-checkin">
      <div className="header">
        <h3 className="daily-checkin-title h4">{t("daily_check_in")}</h3>
        <button className="log-button caption" onClick={handleLogToday}>
          {t("log_today")}
        </button>
      </div>

      <div className="streak-progress-row">
        <div className="streaks">
          <div className="streak">
            <span className="material-symbols-rounded iconfire">
              local_fire_department
            </span>
            <div className="days-container">
              <span className="days-amount caption">
                {currentDays} {t("days")}
              </span>
              <small className="days-label caption">{t("current")}</small>
            </div>
          </div>
          <div className="streak">
            <span className="material-symbols-rounded icontrophy">
              emoji_events
            </span>
            <div className="days-container">
              <span className="days-amount caption">
                {longestDays} {t("days")}
              </span>
              <small className="days-label caption">{t("longest")}</small>
            </div>
          </div>
        </div>

        <div className="weekly-progress">
          <span className="weekly-progress-title caption">
            {t("weekly_progress")}
          </span>
          <WeeklyProgressRow />
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
