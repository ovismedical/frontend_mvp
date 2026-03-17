import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../../../components/ui/tabs";
import Button from "../../../components/ui/button";
import PatientCard from "../../../components/ui/patientCard";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import GenerateReportModal from "../../../components/ui/generateReportModal";
import patientsData from "../../../fixtures/patients.json";
import notificationsData from "../../../fixtures/notifications.json";

const stageOptions = [
  { en: "NED", zh: "无病变" },
  { en: "Remission", zh: "缓解" },
  { en: "Survivorship", zh: "生存期" },
  { en: "Stage 0", zh: "0期" },
  { en: "Stage I", zh: "I期" },
  { en: "Stage II", zh: "II期" },
  { en: "Stage III", zh: "III期" },
  { en: "Stage IV", zh: "IV期" },
  { en: "Refractory", zh: "难治性" },
  { en: "End-of-life", zh: "临终" },
  { en: "Palliative", zh: "姑息" },
  { en: "Progressive", zh: "进展期" },
  { en: "Relapse", zh: "复发" },
  { en: "Recurrence", zh: "复发" },
  { en: "Diagnostic", zh: "诊断期" },
  { en: "Staging Phase", zh: "分期阶段" },
  { en: "Acute Phase", zh: "急性期" },
  { en: "Chronic Phase", zh: "慢性期" },
  { en: "Maintenance", zh: "维持期" },
  { en: "Follow-up", zh: "随访" },
  { en: "Other", zh: "其他" },
];

const PatientDetails = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { patientId } = useParams();
  const patient = patientsData.find((p) => String(p.id) === patientId);

  if (!patient) return <div>Patient not found</div>;

  const [activeTab, setActiveTab] = useState(t("overview"));
  const [showArchived, setShowArchived] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedRefillIdxs, setSelectedRefillIdxs] = useState([]);
  const [refillDetails, setRefillDetails] = useState({});
  const [refillErrors, setRefillErrors] = useState({});
  const [showRefillSuccess, setShowRefillSuccess] = useState(false);
  const [showEditStageModal, setShowEditStageModal] = useState(false);
  const [newStage, setNewStage] = useState(patient.stage?.en || "");
  const [stageError, setStageError] = useState("");
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showGenReport, setShowGenReport] = useState(false);

  const tabs = [
    { name: t("overview") },
    { name: t("medications") },
    { name: t("alerts") },
  ];

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

  const bestDayDate = new Date(2025, 0, 15).toLocaleDateString(
    i18n.language === "zh" ? "zh-CN" : "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const challengingDayDate = new Date(2025, 0, 13).toLocaleDateString(
    i18n.language === "zh" ? "zh-CN" : "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const getMoodStatus = (status) => {
    switch (status) {
      case "Improving":
        return t("improving");
      case "Declining":
        return t("declining");
      default:
        return t("stable");
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Filter notifications for this patient
  const patientNotifications = notificationsData.filter(
    (n) => String(n.patientId) === String(patient.id)
  );

  // Only show alerts (critical, urgent, caution, info)
  const alertSections = [
    { key: "critical", label: t("critical_alerts"), icon: "priority_high" },
    { key: "urgent", label: t("urgent_alerts"), icon: "warning" },
    { key: "caution", label: t("caution_alerts"), icon: "error_outline" },
    { key: "info", label: t("info"), icon: "info" },
  ];

  // Group by importance
  const groupedAlerts = {
    critical: patientNotifications.filter((n) => n.importance === "critical"),
    urgent: patientNotifications.filter((n) => n.importance === "urgent"),
    caution: patientNotifications.filter((n) => n.importance === "caution"),
    info: patientNotifications.filter((n) => n.importance === "info"),
  };

  // Utility for relative time
  const timeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - new Date(timestamp);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t("just_now");
    if (diffMins < 60) return t("minutes_ago", { count: diffMins });
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return t("hours_ago", { count: diffHrs });
    const diffDays = Math.floor(diffHrs / 24);
    return t("days_ago", { count: diffDays });
  };

  // Always use English value for color mapping
  const getTypeColor = (typeObj) => {
    const type = typeof typeObj === "string" ? typeObj : typeObj?.en || "";
    switch (type.toLowerCase()) {
      case "missed medication":
        return "var(--warning-600)";
      case "vitals alert":
        return "var(--error-600)";
      case "symptom spike":
        return "var(--secondary-600)";
      case "lab results":
        return "var(--info-600)";
      case "appointment reminder":
        return "var(--blue-600)";
      case "treatment update":
        return "var(--success-600)";
      case "emergency admission":
        return "var(--error-700)";
      case "allergy alert":
        return "var(--warning-700)";
      case "wellness check":
        return "var(--success-700)";
      case "insurance update":
        return "var(--blue-700)";
      default:
        return "var(--neutral-600)";
    }
  };

  const [medications, setMedications] = useState(patient.medications || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedIdx, setSelectedMedIdx] = useState(null);
  const [discontinueReason, setDiscontinueReason] = useState("");

  // Handler for delete icon
  const handleDeleteClick = (idx) => {
    setSelectedMedIdx(idx);
    setShowDeleteModal(true);
    setDiscontinueReason("");
  };

  // Handler for confirming discontinue
  const handleConfirmDiscontinue = () => {
    setMedications((prev) =>
      prev.map((med, idx) =>
        idx === selectedMedIdx
          ? {
              ...med,
              status: "discontinued",
              endedDate: new Date().toISOString(),
              discontinueReason,
            }
          : med
      )
    );
    setShowDeleteModal(false);
    setSelectedMedIdx(null);
    setDiscontinueReason("");
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    navigate(`/add_medication/${patient.id}`);
  };

  const handleEditClick = (med, idx) => {
    navigate(`/add_medication/${patient.id}`, {
      state: {
        medication: med,
        medIdx: idx,
        patientId: patient.id,
      },
    });
  };

  // Handler to open the refill modal
  const handleOpenRefillModal = () => {
    setSelectedRefillIdxs([]);
    setShowRefillModal(true);
  };

  // Handler for selecting/deselecting meds
  const handleToggleRefillIdx = (idx) => {
    setSelectedRefillIdxs((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    setRefillDetails((prev) =>
      selectedRefillIdxs.includes(idx)
        ? { ...prev, [idx]: undefined }
        : { ...prev, [idx]: { quantity: "", expiry: "" } }
    );
  };

  // Handle input changes:
  const handleRefillInputChange = (idx, field, value) => {
    setRefillDetails((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: field === "expiry" ? formatExpiryInput(value) : value,
      },
    }));
  };

  // Helper to format as DD/MM/YYYY
  const formatExpiryInput = (value) => {
    let digits = value.replace(/\D/g, "");
    digits = digits.slice(0, 8);
    if (digits.length > 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  // Validation function for refill modal (future date)
  const isValidDate = (dateStr) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date > now
    );
  };

  // Only validate on confirm
  const handleConfirmRefill = () => {
    let errors = {};
    let hasError = false;
    selectedRefillIdxs.forEach((idx) => {
      const details = refillDetails[idx] || {};
      const quantityValid = !!details.quantity && Number(details.quantity) > 0;
      const expiryValid = !!details.expiry && isValidDate(details.expiry);
      if (!quantityValid || !expiryValid) {
        errors[idx] = {
          quantity: !quantityValid,
          expiry: !expiryValid,
        };
        hasError = true;
      }
    });
    setRefillErrors(errors);

    if (hasError) return;

    setMedications((prev) =>
      prev.map((med, idx) =>
        selectedRefillIdxs.includes(idx) && med.status === "active"
          ? {
              ...med,
              refilledDate: new Date().toISOString(),
              quantity: refillDetails[idx]?.quantity || med.quantity,
              expiry: refillDetails[idx]?.expiry || med.expiry,
            }
          : med
      )
    );
    setShowRefillModal(false);
    setSelectedRefillIdxs([]);
    setRefillDetails({});
    setRefillErrors({});
    setShowRefillSuccess(true);
    setTimeout(() => setShowRefillSuccess(false), 2000);
  };

  // Handler for opening the modal
  const handleEditStageClick = () => {
    setNewStage(patient.stage?.en || "");
    setStageError("");
    setShowEditStageModal(true);
  };

  // Handler for saving the stage
  const handleSaveStage = () => {
    if (!newStage.trim()) {
      setStageError(t("stage_cannot_be_empty"));
      return;
    }
    // Update patient stage in medications and patient object
    patient.stage = stageOptions.find((s) => s.en === newStage) || {
      en: newStage,
      zh: newStage,
    };
    setMedications((prev) => [...prev]);
    setShowEditStageModal(false);
  };

  return (
    <div className="patient-details-container">
      <div className="patient-details-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate("/doctor_patients")}
        >
          chevron_backward
        </span>
      </div>

      <div className="patient-card-container">
        <PatientCard
          image={patient.avatar}
          name={patient.name}
          cancerType={patient.cancer[i18n.language] || patient.cancer.en}
          stage={patient.stage} // ✅ Pass the full object!
          onEditStage={handleEditStageClick}
          onGenerateReport={() => setShowGenReport(true)}
        />
      </div>

      <Tabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />

      {activeTab === t("overview") && (
        <div className="overview-tab-content">
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
                <span className="material-symbols-rounded mixture_med">
                  mixture_med
                </span>
                <h3 className="daily-health-summary-card-title body">87%</h3>
              </div>
              <p className="daily-health-summary-card-subtext caption">
                {t("medication_adherence")}
              </p>
            </div>
          </div>

          <div className="weekly-summary-container">
            <h2 className="weekly-summary-title h4">{t("weekly_summary")}</h2>

            <div className="weekly-summary-row">
              <div className="wellness-score-card">
                <span
                  className={`wellness-score-value h4 ${
                    wellnessScore.trend === "downward" ? "downward" : "upward"
                  }`}
                >
                  {wellnessScore.value}
                </span>
                <h3 className="wellness-score-title body">
                  {t("wellness_score")}
                </h3>
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
                    {t("vs_last_week", { value: wellnessScore.change })}
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
                <h3 className="engagement-level-title body">
                  {t("engagement_level")}
                </h3>
                <div className="engagement-level-caption-container">
                  <span
                    className={`material-symbols-rounded caption-icon ${
                      engagementLevel.trend === "downward"
                        ? "downward"
                        : "upward"
                    }`}
                  >
                    {engagementLevel.trend === "downward"
                      ? "arrow_downward_alt"
                      : "arrow_upward_alt"}
                  </span>
                  <span className="engagement-level-caption caption">
                    {t("vs_last_week", { value: engagementLevel.change })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mood-trend-container">
              <div className="mood-trend-header">
                <span className="mood-trend-title h4">{t("mood_trend")}</span>
                <span
                  className={`mood-trend-status ${moodTrend.status} caption`}
                >
                  {getMoodStatus(moodTrend.status)}
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
                        {t(day)}
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
                  <h4 className="weekly-summary-bestDay-title h4">
                    {t("best_day")}
                  </h4>
                  <p className="weekly-summary-bestDay-date body">
                    {bestDayDate}
                  </p>
                </div>
              </div>
              <p className="weekly-summary-bestDay-summary caption">
                {t("best_day_summary")}
              </p>
            </div>

            <div className="weekly-summary-challengingDay">
              <div className="weekly-summary-day-left">
                <span className="weekly-summary-challengingDay-dayIcon">
                  <span className="material-symbols-rounded swords">
                    swords
                  </span>
                </span>
                <div className="weekly-summary-day-text">
                  <h4 className="weekly-summary-challengingDay-title h4">
                    {t("challenging_day")}
                  </h4>
                  <p className="weekly-summary-challengingDay-date body">
                    {challengingDayDate}
                  </p>
                </div>
              </div>
              <p className="weekly-summary-challengingDay-summary caption">
                {t("challenging_day_summary")}
              </p>
            </div>
          </div>

          <div className="weekly-smart-insight">
            <h2 className="weekly-insights-title h4">{t("smart_insights")}</h2>
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
      )}

      {activeTab === t("medications") && (
        <div className="medications-tab-content">
          <div className="medications-tab-buttons">
            <Button
              variant="filled"
              iconName="add"
              iconPosition="left"
              iconFill={1}
              className="add-medication-button"
              onClick={handleAddMedication}
            >
              {t("add_medication")}
            </Button>

            <Button
              variant="filled"
              iconName="refresh"
              iconPosition="left"
              iconFill={1}
              className="refill-medication-button"
              onClick={handleOpenRefillModal}
            >
              {t("refill_medication")}
            </Button>
          </div>

          <div className="patient-medications-list">
            {/* Current Medications */}
            <div className="medications-section">
              <h3 className="medications-section-title h4">
                {t("current_medications")}
                <span className="medications-active-count caption">
                  {medications.filter((m) => m.status === "active").length}{" "}
                  {t("active")}
                </span>
              </h3>

              {medications
                .filter((m) => m.status === "active")
                .map((med, idx) => (
                  <div key={idx} className="medication-card">
                    <div className="medication-header">
                      <h4 className="med-name h4">{med.medName}</h4>
                      <div className="active-medication-actions">
                        <span
                          className="material-symbols-rounded edit-medication"
                          onClick={() => handleEditClick(med, idx)}
                        >
                          ink_pen
                        </span>
                        <span
                          className="material-symbols-rounded delete-medication"
                          onClick={() => handleDeleteClick(idx)}
                        >
                          delete
                        </span>
                      </div>
                    </div>
                    <p className="med-dose caption">
                      {med.strength} • {med.dosageInstructions}
                    </p>
                    <p className="med-date caption">
                      {med.refilledDate
                        ? `${t("refilled")}: ${new Date(
                            med.refilledDate
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}`
                        : `${t("started")}: ${new Date(
                            med.startedDate
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}`}
                    </p>
                    <p className="med-desc caption">{med.usedFor}</p>
                  </div>
                ))}
            </div>

            {/* Archived Medications */}
            <div className="medications-section">
              <div
                className="medications-section-title archived h4"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => setShowArchived((prev) => !prev)}
              >
                {t("archived_medication")}
                <span
                  className={`material-symbols-rounded archived-chevron${
                    showArchived ? " rotated" : ""
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </div>
              {showArchived &&
                medications
                  .filter((m) => m.status !== "active")
                  .map((med, idx) => (
                    <div
                      key={idx}
                      className={`medication-card archived ${med.status}`}
                    >
                      <div className="medication-header">
                        <h4 className="med-name h4">{med.medName}</h4>
                        <span
                          className={`status-badge caption ${
                            med.status === "completed"
                              ? "completed"
                              : "discontinued"
                          }`}
                        >
                          {med.status === "completed"
                            ? t("completed")
                            : t("discontinued")}
                        </span>
                      </div>
                      <p className="med-dose caption">
                        {med.strength} • {med.dosageInstructions}
                      </p>
                      <p className="med-date caption">
                        {med.endedDate &&
                          `${t("ended")}: ${new Date(
                            med.endedDate
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}`}
                      </p>
                      <p className="med-desc caption">{med.usedFor}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === t("alerts") &&
        (() => {
          const hasAlerts =
            groupedAlerts.critical.length > 0 ||
            groupedAlerts.urgent.length > 0 ||
            groupedAlerts.caution.length > 0 ||
            groupedAlerts.info.length > 0;

          if (!hasAlerts) {
            return (
              <div className="doctor-notifications-list-empty h4">
                {t("no_alerts_for", { name: patient.name })}
              </div>
            );
          }

          return (
            <div className="doctor-notifications-list-grid">
              <div className="doctor-notifications-list-col">
                {alertSections.slice(0, 2).map(
                  (s) =>
                    groupedAlerts[s.key].length > 0 && (
                      <div
                        key={s.key}
                        className={`doctor-notifications-section ${s.key}`}
                      >
                        <div
                          className={`doctor-notifications-section-header ${s.key} caption`}
                        >
                          <span className="material-symbols-rounded doctor-notifications-header-icon">
                            {s.icon}
                          </span>
                          {s.label} ({groupedAlerts[s.key].length})
                        </div>
                        {groupedAlerts[s.key].map((n) => (
                          <div key={n.id} className="doctor-notifications-item">
                            <div className="doctor-notifications-info">
                              <div className="doctor-notifications-info-row">
                                <span className="doctor-notifications-patient h4">
                                  {n.title}
                                </span>
                                <span className="doctor-notifications-time caption">
                                  {timeAgo(n.timestamp)}
                                </span>
                              </div>
                              <div
                                className="doctor-notifications-type-tag caption"
                                style={{ color: getTypeColor(n.type) }}
                              >
                                {n.type[i18n.language] || n.type.en}
                              </div>
                              <div className="doctor-notifications-description body">
                                {n.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                )}
              </div>
              <div className="doctor-notifications-list-col">
                {alertSections.slice(2, 4).map(
                  (s) =>
                    groupedAlerts[s.key].length > 0 && (
                      <div
                        key={s.key}
                        className={`doctor-notifications-section ${s.key}`}
                      >
                        <div
                          className={`doctor-notifications-section-header ${s.key} caption`}
                        >
                          <span className="material-symbols-rounded doctor-notifications-header-icon">
                            {s.icon}
                          </span>
                          {s.label} ({groupedAlerts[s.key].length})
                        </div>
                        {groupedAlerts[s.key].map((n) => (
                          <div key={n.id} className="doctor-notifications-item">
                            <div className="doctor-notifications-info">
                              <div className="doctor-notifications-info-row">
                                <span className="doctor-notifications-patient h4">
                                  {n.type[i18n.language] || n.type.en}
                                </span>
                                <span className="doctor-notifications-time caption">
                                  {timeAgo(n.timestamp)}
                                </span>
                              </div>
                              <div
                                className="doctor-notifications-type-tag caption"
                                style={{ color: getTypeColor(n.type) }}
                              >
                                {n.type[i18n.language] || n.type.en}
                              </div>
                              <div className="doctor-notifications-description body">
                                {n.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                )}
              </div>
            </div>
          );
        })()}

      {/* Modal for discontinue reason */}
      {showDeleteModal && (
        <div className="medication-modal-overlay">
          <div className="medication-modal">
            <div className="medication-modal-header">
              <h3 className="medication-modal-title h4">
                {t("discontinue_medication")}
              </h3>
              <span
                className="material-symbols-rounded delete-modal-close-icon"
                onClick={() => setShowDeleteModal(false)}
              >
                close
              </span>
            </div>
            <p className="medication-modal-subtext body">
              {t("enter_discontinue_reason")}
            </p>
            <textarea
              className="delete-medication-textarea body"
              value={discontinueReason}
              onChange={(e) => setDiscontinueReason(e.target.value)}
              rows={3}
            />
            <div className="medication-modal-footer">
              <button
                className="delete-medication-confirm-button body"
                onClick={handleConfirmDiscontinue}
              >
                {t("confirm")}
              </button>
              <button
                className="delete-medication-cancel-button body"
                onClick={() => setShowDeleteModal(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refill Medication Modal */}
      {showRefillModal && (
        <div className="medication-modal-overlay">
          <div className="medication-modal refill-modal">
            <div className="medication-modal-header">
              <h3 className="medication-modal-title h4">
                {t("refill_medication")}
              </h3>
              <span
                className="material-symbols-rounded delete-modal-close-icon"
                onClick={() => setShowRefillModal(false)}
              >
                close
              </span>
            </div>
            <p
              className="medication-modal-subtext body"
              style={{ marginBottom: 16 }}
            >
              {t("select_medications_to_refill")}
            </p>
            <div className="refill-medications-list">
              {medications
                .map((med, idx) => ({ ...med, idx }))
                .filter((med) => med.status === "active")
                .map((med) => {
                  const details = refillDetails[med.idx] || {};
                  const error = refillErrors[med.idx] || {};
                  return (
                    <div key={med.idx} className="refill-medication-row">
                      <label className="refill-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedRefillIdxs.includes(med.idx)}
                          onChange={() => handleToggleRefillIdx(med.idx)}
                          className="refill-checkbox"
                        />
                        <span>
                          <b className="body">{med.medName}</b>
                          <span className="refill-medication-details caption">
                            {med.strength} • {med.dosageInstructions}
                          </span>
                        </span>
                      </label>
                      {selectedRefillIdxs.includes(med.idx) && (
                        <div className="refill-inputs-row">
                          <input
                            type="number"
                            placeholder={t("quantity")}
                            min={1}
                            value={details.quantity || ""}
                            onChange={(e) =>
                              handleRefillInputChange(
                                med.idx,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="refill-input caption"
                          />
                          <input
                            type="text"
                            placeholder="DD/MM/YYYY"
                            value={details.expiry || ""}
                            onChange={(e) =>
                              handleRefillInputChange(
                                med.idx,
                                "expiry",
                                e.target.value
                              )
                            }
                            maxLength={10}
                            className="refill-input caption"
                          />
                        </div>
                      )}
                      {selectedRefillIdxs.includes(med.idx) &&
                        (error.quantity || error.expiry) && (
                          <div
                            style={{
                              color: "var(--error-600)",
                              fontSize: 13,
                              marginLeft: 28,
                              marginTop: 2,
                            }}
                          >
                            {error.quantity && t("enter_valid_quantity")}
                            {error.expiry && t("enter_valid_future_date")}
                          </div>
                        )}
                    </div>
                  );
                })}
              {medications.filter((m) => m.status === "active").length ===
                0 && (
                <div style={{ color: "var(--text-400)", padding: 8 }}>
                  {t("no_active_medications")}
                </div>
              )}
            </div>
            <div className="medication-modal-footer">
              <button
                className="delete-medication-confirm-button body"
                disabled={selectedRefillIdxs.length === 0}
                onClick={handleConfirmRefill}
              >
                {t("confirm")}
              </button>
              <button
                className="delete-medication-cancel-button body"
                onClick={() => setShowRefillModal(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success message with overlay */}
      {showRefillSuccess && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 2999,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--success-50)",
              color: "var(--success-700)",
              padding: "14px 28px",
              borderRadius: "var(--radius-l)",
              fontWeight: 500,
              fontSize: 17,
              zIndex: 3000,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              textAlign: "center",
            }}
          >
            {t("medications_refilled_success")}
          </div>
        </>
      )}

      {/* Edit Stage Modal */}
      {showEditStageModal && (
        <div className="medication-modal-overlay">
          <div className="medication-modal">
            <div className="medication-modal-header">
              <h3 className="medication-modal-title h4">
                {t("update_cancer_stage")}
              </h3>
              <span
                className="material-symbols-rounded delete-modal-close-icon"
                onClick={() => setShowEditStageModal(false)}
              >
                close
              </span>
            </div>
            <p className="medication-modal-subtext body">
              {t("enter_new_cancer_stage")}
            </p>
            <div
              className="edit-stage-dropdown"
              tabIndex={0}
              onBlur={() => setShowStageDropdown(false)}
            >
              <div
                className={
                  "edit-stage-dropdown-selected body" +
                  (!newStage ? " placeholder" : "") +
                  (stageError ? " error" : "")
                }
                onClick={() => setShowStageDropdown((v) => !v)}
              >
                {stageOptions.find((s) => s.en === newStage)?.[i18n.language] ||
                  newStage ||
                  t("select_stage")}
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: 18 }}
                >
                  expand_more
                </span>
              </div>
              {showStageDropdown && (
                <div className="edit-stage-dropdown-list">
                  {stageOptions.map((stage) => (
                    <div
                      key={stage.en}
                      className={
                        "edit-stage-dropdown-item body" +
                        (newStage === stage.en ? " selected" : "")
                      }
                      onClick={() => {
                        setNewStage(stage.en);
                        setShowStageDropdown(false);
                      }}
                    >
                      {stage[i18n.language] || stage.en}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {stageError && (
              <div
                style={{
                  color: "var(--error-600)",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                {stageError}
              </div>
            )}
            <div className="medication-modal-footer">
              <button
                className="delete-medication-confirm-button body"
                onClick={handleSaveStage}
              >
                {t("save")}
              </button>
              <button
                className="delete-medication-cancel-button body"
                onClick={() => setShowEditStageModal(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenReport && (
        <GenerateReportModal onClose={() => setShowGenReport(false)} />
      )}
    </div>
  );
};

export default PatientDetails;
