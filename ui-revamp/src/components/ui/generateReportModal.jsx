import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Tabs from "../../components/ui/tabs";
import "../../styles/components/generateReportModal.css";
import Button from "../../components/ui/button";

const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getWeekAgo = () => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6); // 7 days including today
  return weekAgo.toISOString().split("T")[0];
};

const GenerateReportModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("By Weeks");

  // state for weeks/months
  const [weeks, setWeeks] = useState(1);
  const [months, setMonths] = useState(1);

  // state for custom range
  const [fromDate, setFromDate] = useState(getWeekAgo());
  const [toDate, setToDate] = useState(getToday());
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "Custom Range") {
      const days =
        Math.ceil(
          (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
        ) + 1;
      if (days < 7) {
        setError(t("select_at_least_7_days"));
      } else {
        setError("");
      }
    }
  }, [fromDate, toDate, activeTab, t]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setError("");
    if (tabName === "Custom Range") {
      setFromDate(getWeekAgo());
      setToDate(getToday());
    }
  };

  const handleGenerate = () => {
    if (activeTab === "By Weeks") {
      if (weeks < 1) {
        setError(t("select_at_least_1_week"));
        return;
      }
      setError("");
      console.log(`Generating report for ${weeks} week(s).`);
    } else if (activeTab === "By Month") {
      if (months < 1) {
        setError(t("select_at_least_1_month"));
        return;
      }
      setError("");
      console.log(`Generating report for ${months} month(s).`);
    } else {
      const days =
        Math.ceil(
          (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
        ) + 1;
      if (days < 7) {
        setError(t("select_at_least_7_days"));
        return;
      }
      setError("");
      console.log(`Generating report from ${fromDate} to ${toDate}.`);
    }
  };

  const tabs = [
    { name: t("by_weeks") },
    { name: t("by_month") },
    { name: t("custom_range") },
  ];

  const todayStr = getToday();

  let customRangeDays =
    Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) +
    1;

  return (
    <div className="generate-report-modal-overlay">
      <div className="generate-report-modal">
        <div className="generate-report-modal-header">
          <h3 className="generate-report-modal-title h4">
            {t("generate_health_report")}
          </h3>
          <span
            className="material-symbols-rounded close-icon"
            onClick={onClose}
          >
            close
          </span>
        </div>

        <Tabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />

        <div className="generate-report-modal-content">
          {activeTab === t("by_weeks") && (
            <div className="range-selector">
              <button onClick={() => setWeeks(Math.max(1, weeks - 1))}>
                −
              </button>
              <span>
                {weeks} {t("weeks")}
              </span>
              <button onClick={() => setWeeks(weeks + 1)}>+</button>
            </div>
          )}

          {activeTab === t("by_month") && (
            <div className="range-selector">
              <button onClick={() => setMonths(Math.max(1, months - 1))}>
                −
              </button>
              <span>
                {months} {t("months")}
              </span>
              <button onClick={() => setMonths(months + 1)}>+</button>
            </div>
          )}

          {activeTab === t("custom_range") && (
            <div className="custom-range-selector">
              <div className="date-picker">
                <label>
                  {t("from")}
                  <input
                    type="date"
                    value={fromDate}
                    max={todayStr}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setError("");
                    }}
                  />
                </label>
                <label>
                  {t("to")}
                  <input
                    type="date"
                    value={toDate}
                    max={todayStr}
                    min={fromDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setError("");
                    }}
                  />
                </label>
                <p className="custom-range-info-message caption">
                  {t("generating_days_report", { count: customRangeDays })}
                </p>
              </div>
              {error && (
                <p className="custom-range-error-message caption">{error}</p>
              )}
            </div>
          )}
        </div>

        <div className="generate-report-modal-actions">
          <Button variant="outline" className="cancel-btn" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="filled"
            className="generate-btn"
            onClick={handleGenerate}
            disabled={
              (activeTab === "Custom Range" && customRangeDays < 7) ||
              (activeTab === "By Weeks" && weeks < 1) ||
              (activeTab === "By Month" && months < 1)
            }
          >
            {t("generate_report")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;
