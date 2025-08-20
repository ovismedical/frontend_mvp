import React from "react";
import { useTranslation } from "react-i18next";
import SmartInsightCard from "../../components/ui/smartInsightCard";
import SymptomTrackCard from "../../components/ui/symptomTrackCard";

const DailyDashboard = () => {
  const { t, i18n } = useTranslation();

  const formattedDate = new Date().toLocaleDateString(
    i18n.language === "zh" ? "zh-CN" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="daily-dashboard-content">
      <div className="daily-health-summary">
        <div className="daily-health-summary-top">
          <h2 className="daily-health-summary-title h4">
            {t("daily_health_summary")}
          </h2>
          <p className="daily-health-summary-date caption">{formattedDate}</p>
        </div>
        <div className="daily-health-summary-cards">
          <div className="daily-health-summary-card">
            <div className="daily-health-summary-card-info">
              <span className="material-symbols-rounded assignment_turned_in">
                assignment_turned_in
              </span>
              <h3 className="daily-health-summary-card-title body">
                {t("stable_health")}
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              {t("all_within_normal_range")}
            </p>
          </div>
          <div className="daily-health-summary-card">
            <div className="daily-health-summary-card-info">
              <span className="material-symbols-rounded local_fire_department">
                local_fire_department
              </span>
              <h3 className="daily-health-summary-card-title body">
                {t("day_streak", { count: 12 })}
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              {t("tracking_consistently")}
            </p>
          </div>
        </div>
      </div>
      <div className="daily-symptom-track">
        <h2 className="daily-symptom-track-title h4">
          {t("symptoms_tracked_today")}
        </h2>
        <SymptomTrackCard iconName="mood" title={t("mood")} intensity={8} />
        <SymptomTrackCard
          iconName="battery_alert"
          title={t("energy_level")}
          intensity={2}
        />
        <SymptomTrackCard
          iconName="bedtime"
          title={t("sleep_quality")}
          intensity={6}
        />
        <SymptomTrackCard
          iconName="favorite"
          title={t("pain_level")}
          intensity={3}
        />
      </div>

      <div className="daily-smart-insight">
        <h2 className="daily-insights-title h4">{t("smart_insights")}</h2>
        <SmartInsightCard
          icon="sentiment_satisfied"
          title={t("mood_sleep_link_detected")}
          description={t("mood_sleep_link_description")}
          insightType="info"
        />
        <SmartInsightCard
          icon="warning"
          title={t("low_activity_detected")}
          description={t("low_activity_description")}
          insightType="warning"
        />
        <SmartInsightCard
          icon="celebration"
          title={t("mood_boost")}
          description={t("mood_boost_description")}
          insightType="success"
        />
        <SmartInsightCard
          icon="error"
          title={t("missed_medication")}
          description={t("missed_medication_description")}
          insightType="error"
        />
      </div>
    </div>
  );
};

export default DailyDashboard;
