import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { doctorAPI } from "../../utils/api";
import { effectiveLevel, isPendingReview } from "../../utils/alertLevels";

// utility: format relative time
const timeAgo = (timestamp, t) => {
  const now = new Date();
  const diffMs = now - new Date(timestamp);
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return t("just_now");
  if (diffMins < 60) return t("min_ago", { count: diffMins });
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24)
    return t(diffHrs === 1 ? "hour_ago" : "hours_ago", { count: diffHrs });
  const diffDays = Math.floor(diffHrs / 24);
  return t(diffDays === 1 ? "day_ago" : "days_ago", { count: diffDays });
};

// A record whose AI assessment was refused has no level until a clinician assigns one.
// Once it carries a review, that clinician-assigned level drives its urgency like any other.
const needsClinicianReview = (alert) => isPendingReview(alert) && !alert.review;

// Map an alert record to importance, using the level after any clinician override.
const alertToImportance = (alert) => {
  if (needsClinicianReview(alert)) return "pending";
  switch (effectiveLevel(alert)) {
    case "RED": return "critical";
    case "ORANGE": return "urgent";
    case "YELLOW": return "caution";
    default: return "info";
  }
};

// Map assessment_type to display type
const assessmentTypeLabel = (type) => {
  switch (type) {
    case "questionnaire_triage": return "Symptom Questionnaire";
    case "florence_conversation_with_triage": return "AI Conversation";
    default: return "Assessment";
  }
};

const sections = [
  { key: "critical", label: "critical_alerts", icon: "priority_high" },
  { key: "urgent", label: "urgent_alerts", icon: "warning" },
  { key: "caution", label: "caution_alerts", icon: "error_outline" },
  { key: "pending", label: "needs_review", icon: "pending" },
  { key: "info", label: "info", icon: "info" },
];

const DoctorNotifications = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedImportances, setSelectedImportances] = useState([]);
  const [openSections, setOpenSections] = useState({
    type: false,
    importance: false,
  });
  const filterMenuRef = useRef(null);
  const [enrichedNotifications, setEnrichedNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real alerts and patient details from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const [alertsRes, patientsRes] = await Promise.all([
          doctorAPI.getAlerts(),
          doctorAPI.getPatientDetails(),
        ]);

        const patientMap = {};
        if (patientsRes?.patients) {
          patientsRes.patients.forEach((p) => {
            patientMap[p.username] = p;
          });
        }

        const notifications = (alertsRes?.alerts || []).map((alert, idx) => {
          const patient = patientMap[alert.patient_id] || {};
          return {
            id: alert.session_id || idx,
            importance: alertToImportance(alert),
            type: assessmentTypeLabel(alert.assessment_type),
            description:
              alert.alert_rationale ||
              (alert.key_symptoms || []).join(", ") ||
              (needsClinicianReview(alert) ? t("needs_review") : t("flagged_for_review")),
            timestamp: alert.created_at,
            patient: {
              name: patient.full_name || alert.patient_id,
              username: alert.patient_id,
            },
            key_symptoms: alert.key_symptoms || [],
            recommended_timeline: alert.recommended_timeline,
          };
        });

        setEnrichedNotifications(notifications);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [t]);

  const notificationTypes = [
    ...new Set(enrichedNotifications.map((n) => n.type)),
  ];

  const importanceOptions = sections.map((s) => s.key);

  useEffect(() => {
    if (!showFilter) return;
    const handleClick = (e) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showFilter]);

  const toggleSelection = (value) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleImportance = (value) => {
    setSelectedImportances((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedImportances([]);
  };

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // filtering
  const filteredNotifications = enrichedNotifications.filter((n) => {
    const matchesSearch =
      n.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(n.type);
    const matchesImportance =
      selectedImportances.length === 0 ||
      selectedImportances.includes(n.importance);
    return matchesSearch && matchesType && matchesImportance;
  });

  // group by importance
  const grouped = {
    critical: filteredNotifications.filter((n) => n.importance === "critical"),
    urgent: filteredNotifications.filter((n) => n.importance === "urgent"),
    caution: filteredNotifications.filter((n) => n.importance === "caution"),
    pending: filteredNotifications.filter((n) => n.importance === "pending"),
    info: filteredNotifications.filter((n) => n.importance === "info"),
  };

  // Map type to color
  const getTypeColor = (type) => {
    switch (type) {
      case "Symptom Questionnaire":
        return "var(--on-secondary-tint)";
      case "AI Conversation":
        return "var(--on-info-tint)";
      default:
        return "var(--on-neutral-tint)";
    }
  };

  return (
    <div className="doctor-notifications-container">
      {/* Header */}
      <div className="doctor-notifications-header">
        <span className="material-symbols-rounded"></span>
        <div className="doctor-notifications-header h4">{t("follow_ups")}</div>
        <span className="material-symbols-rounded"></span>
      </div>

      {/* Search + Filter row */}
      <div className="doctor-notifications-search-filter-row">
        <div className="doctor-notifications-search-box">
          <span className="material-symbols-rounded doctor-notifications-search-icon">
            search
          </span>
          <input
            className="body"
            type="text"
            placeholder={t("search_patients")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="doctor-notifications-filter-btn-wrap">
          <button
            className={`doctor-notifications-filter-btn ${
              showFilter ? "active" : ""
            }`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <span className="material-symbols-rounded doctor-notifications-filter-icon">
              filter_list
            </span>
          </button>
        </div>
      </div>

      {/* Filter dropdown */}
      {showFilter && (
        <div className="doctor-notifications-filter-menu" ref={filterMenuRef}>
          <div className="doctor-notifications-filter-menu-header">
            <h3 className="doctor-notifications-filter-menu-header-title h4">
              {t("filters")}
            </h3>
            <button
              className="doctor-notifications-clear-filters caption"
              onClick={clearFilters}
            >
              {t("clear_filters")}
            </button>
          </div>
          {/* Importance Section */}
          <div className="doctor-notifications-filter-section">
            <div
              className="doctor-notifications-filter-section-header body"
              onClick={() => toggleSection("importance")}
            >
              <span>{t("importance")}</span>
              <span className="material-symbols-rounded doctor-notifications-filter-section-header-icon">
                {openSections.importance ? "expand_less" : "expand_more"}
              </span>
            </div>
            {openSections.importance && (
              <div className="doctor-notifications-filter-options">
                {sections.map((imp) => (
                  <label
                    key={imp.key}
                    className={`doctor-notifications-filter-option caption${
                      selectedImportances.includes(imp.key) ? " selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedImportances.includes(imp.key)}
                      onChange={() => toggleImportance(imp.key)}
                    />
                    {t(imp.label)}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Notification Type Section */}
          <div className="doctor-notifications-filter-section">
            <div
              className="doctor-notifications-filter-section-header body"
              onClick={() => toggleSection("type")}
            >
              <span>{t("type")}</span>
              <span className="material-symbols-rounded doctor-notifications-filter-section-header-icon">
                {openSections.type ? "expand_less" : "expand_more"}
              </span>
            </div>
            {openSections.type && (
              <div className="doctor-notifications-filter-options">
                {notificationTypes.map((type) => (
                  <label
                    key={type}
                    className={`doctor-notifications-filter-option caption${
                      selectedTypes.includes(type) ? " selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleSelection(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification List */}
      <div className="doctor-notifications-list">
        <div className="doctor-notifications-list-grid">
          <div className="doctor-notifications-list-col">
            {sections.slice(0, 2).map(
              (s) =>
                grouped[s.key].length > 0 && (
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
                      {t(s.label)} ({grouped[s.key].length})
                    </div>
                    {grouped[s.key].map((n) => (
                      <div key={n.id} className="doctor-notifications-item">
                        <div className="doctor-notifications-avatar-placeholder">
                          {(n.patient?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="doctor-notifications-info">
                          <div className="doctor-notifications-info-row">
                            <span className="doctor-notifications-patient h4">
                              {n.patient?.name}
                            </span>
                            <span className="doctor-notifications-time caption">
                              {timeAgo(n.timestamp, t)}
                            </span>
                          </div>
                          <div
                            className="doctor-notifications-type-tag caption"
                            style={{
                              color: getTypeColor(n.type),
                            }}
                          >
                            {n.type}
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
            {sections.slice(2).map(
              (s) =>
                grouped[s.key].length > 0 && (
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
                      {t(s.label)} ({grouped[s.key].length})
                    </div>
                    {grouped[s.key].map((n) => (
                      <div key={n.id} className="doctor-notifications-item">
                        <div className="doctor-notifications-avatar-placeholder">
                          {(n.patient?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="doctor-notifications-info">
                          <div className="doctor-notifications-info-row">
                            <span className="doctor-notifications-patient h4">
                              {n.patient?.name}
                            </span>
                            <span className="doctor-notifications-time caption">
                              {timeAgo(n.timestamp, t)}
                            </span>
                          </div>
                          <div
                            className="doctor-notifications-type-tag caption"
                            style={{
                              color: getTypeColor(n.type),
                            }}
                          >
                            {n.type}
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
      </div>
    </div>
  );
};

export default DoctorNotifications;
