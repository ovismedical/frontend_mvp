import React from "react";
import SmartInsightCard from "../../components/ui/smartInsightCard";
import SymptomTrackCard from "../../components/ui/symptomTrackCard";

const DailyDashboard = () => {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="daily-dashboard-content">
      <div className="daily-health-summary">
        <div className="daily-health-summary-top">
          <h2 className="daily-health-summary-title h4">
            Daily Health Summary
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
                Stable health
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              All within normal range
            </p>
          </div>
          <div className="daily-health-summary-card">
            <div className="daily-health-summary-card-info">
              <span className="material-symbols-rounded local_fire_department">
                local_fire_department
              </span>
              <h3 className="daily-health-summary-card-title body">
                12 Day Streak
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              Tracking consistently
            </p>
          </div>
        </div>
      </div>
      <div className="daily-symptom-track">
        <h2 className="daily-symptom-track-title h4">Symptoms Tracked Today</h2>
        <SymptomTrackCard iconName="mood" title="Mood" intensity={8} />
        <SymptomTrackCard
          iconName="battery_alert"
          title="Energy Level"
          intensity={2}
        />
        <SymptomTrackCard
          iconName="bedtime"
          title="Sleep Quality"
          intensity={6}
        />
        <SymptomTrackCard
          iconName="favorite"
          title="Pain Level"
          intensity={3}
        />
      </div>

      <div className="daily-smart-insight">
        <h2 className="daily-insights-title h4"> Smart Insights</h2>
        <SmartInsightCard
          icon="sentiment_satisfied"
          title="Mood & Sleep Link Detected"
          description="Your mood tends to improve on nights with 7+ hours of sleep."
          insightType="info"
        />
        <SmartInsightCard
          icon="warning"
          title="Low Activity Detected"
          description="Your activity levels dropped below your weekly average."
          insightType="warning"
        />
        <SmartInsightCard
          icon="celebration"
          title="Mood Boost"
          description="You report better mood scores on Saturdays compared to weekdays."
          insightType="success"
        />
        <SmartInsightCard
          icon="error"
          title="Missed Medication"
          description="You missed your medication on Tuesday. Try to set a reminder."
          insightType="error"
        />
      </div>
    </div>
  );
};

export default DailyDashboard;
