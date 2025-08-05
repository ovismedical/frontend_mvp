import React from "react";
import WeeklyProgressRow from "../../components/ui/weekly_ProgressRow";
import SmartInsightCard from "../../components/ui/smartInsightCard";

const WeeklyDashboard = () => {
  const wellnessScore = {
    value: 4.2,
    trend: "downward", // or 'upward'
    change: 4.1,
  };

  const engagementLevel = {
    value: 8,
    trend: "upward", // or 'downward'
    change: 2.5,
  };

  const moodTrend = {
    mon: 1,
    tue: 2,
    wed: 4,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
    status: "Improving",
  };

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const maxMood = Math.max(...days.map((day) => moodTrend[day]));

  const getMoodShade = (value) => {
    if (value === 0) return "shade-0";
    if (value <= 1) return "shade-1";
    if (value <= 2) return "shade-2";
    if (value <= 3) return "shade-3";
    if (value <= 4) return "shade-4";
    return "shade-5";
  };

  const bestDayDate = "Wednesday, Jan 15";
  const challengingDayDate = "Monday, Jan 13";

  return (
    <div className="weekly-dashboard-content">
      <div className="current-streak-container">
        <div className="current-streak-row">
          <h2 className="current-streak-title h4">Current Streak</h2>
          <div className="current-streak-value">
            <span className="material-symbols-rounded streak-icon">
              local_fire_department
            </span>
            <span className="streak-label body-semibold">2 days</span>
          </div>
        </div>
        <div className="weekly-progress-row">
          <WeeklyProgressRow labelFormat="full" labelPosition="above" />
        </div>
        <div className="current-streak-caption caption">
          Keep it up! You’re doing great this week.
        </div>
      </div>

      <div className="weekly-summary-container">
        <h2 className="weekly-summary-title h4"> Weekly Summary</h2>

        <div className="weekly-summary-row">
          <div className="wellness-score-card">
            <span
              className={`wellness-score-value h4 ${
                wellnessScore.trend === "downward" ? "downward" : "upward"
              }`}
            >
              {wellnessScore.value}
            </span>
            <h3 className="wellness-score-title body">Wellness Score</h3>
            <div className="wellness-score-caption-container">
              <span
                className={`material-symbols-rounded caption-icon ${
                  wellnessScore.trend === "downward" ? "downward" : "upward"
                }`}
              >
                {wellnessScore.trend === "downward"
                  ? "arrow_downward_alt"
                  : "arrow_upward_alt"}
              </span>
              <span className="wellness-score-caption caption">
                vs {wellnessScore.change} last week
              </span>
            </div>
          </div>

          <div className="engagement-level-card">
            <span
              className={`engagement-level-value h4 ${
                engagementLevel.trend === "downward" ? "downward" : "upward"
              }`}
            >
              {engagementLevel.value}
            </span>
            <h3 className="engagement-level-title body">Engagement Level</h3>
            <div className="engagement-level-caption-container">
              <span
                className={`material-symbols-rounded caption-icon ${
                  engagementLevel.trend === "downward" ? "downward" : "upward"
                }`}
              >
                {engagementLevel.trend === "downward"
                  ? "arrow_downward_alt"
                  : "arrow_upward_alt"}
              </span>
              <span className="engagement-level-caption caption">
                vs {engagementLevel.change} last week
              </span>
            </div>
          </div>
        </div>

        <div className="mood-trend-container">
          <div className="mood-trend-header">
            <span className="mood-trend-title h4">Mood Trend</span>
            <span className={`mood-trend-status ${moodTrend.status} caption`}>
              {moodTrend.status}
              <span
                className={`material-symbols-rounded mood-trend-arrow ${
                  moodTrend.status === "Improving" ? "upward" : "downward"
                }`}
              >
                {moodTrend.status === "Improving"
                  ? "trending_up"
                  : "trending_down"}
              </span>
            </span>
          </div>
          <div className="mood-trend-bar-chart">
            {days.map((day) => {
              const value = moodTrend[day];
              const height = `${(value / (maxMood || 1)) * 100}%`;
              return (
                <div key={day} className="mood-trend-bar-wrapper">
                  <div
                    className={`mood-trend-bar ${getMoodShade(value)}`}
                    style={{
                      height,
                    }}
                  ></div>
                  <span className="mood-trend-day-label overline-timestamp">
                    {day.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="weekly-summary-days">
        <div className="weekly-summary-bestDay">
          <div className="weekly-summary-day-left">
            <span className="weekly-summary-bestDay-dayIcon">
              <span className="material-symbols-rounded family_star">
                family_star
              </span>
            </span>
            <div className="weekly-summary-day-text">
              <h4 className="weekly-summary-bestDay-title h4">Best Day</h4>
              <p className="weekly-summary-bestDay-date body">{bestDayDate}</p>
            </div>
          </div>
          <p className="weekly-summary-bestDay-summary caption">
            Less pain, good energy levels
          </p>
        </div>

        <div className="weekly-summary-challengingDay">
          <div className="weekly-summary-day-left">
            <span className="weekly-summary-challengingDay-dayIcon">
              <span className="material-symbols-rounded swords">swords</span>
            </span>
            <div className="weekly-summary-day-text">
              <h4 className="weekly-summary-challengingDay-title h4">
                Challenging Day
              </h4>
              <p className="weekly-summary-challengingDay-date body">
                {challengingDayDate}
              </p>
            </div>
          </div>
          <p className="weekly-summary-challengingDay-summary caption">
            Fatigue spiked, needed extra rest
          </p>
        </div>
      </div>

      <div className="weekly-smart-insight">
        <h2 className="weekly-insights-title h4"> Smart Insights</h2>
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

export default WeeklyDashboard;
