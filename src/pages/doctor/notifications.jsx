import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import notificationsData from "../../fixtures/notifications.json";
import patientsData from "../../fixtures/patients.json";

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

const sections = [
  { key: "critical", label: "critical_alerts", icon: "priority_high" },
  { key: "urgent", label: "urgent_alerts", icon: "warning" },
  { key: "caution", label: "caution_alerts", icon: "error_outline" },
  { key: "info", label: "info", icon: "info" },
];

const DoctorNotifications = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedImportances, setSelectedImportances] = useState([]);
  const [openSections, setOpenSections] = useState({
    type: false,
    importance: false,
  });
  const filterMenuRef = useRef(null);

  // merge notifications with patient info
  const enrichedNotifications = notificationsData.map((n) => {
    const patient = patientsData.find((p) => p.id === n.patientId);
    return { ...n, patient };
  });

  const notificationTypes = [
    ...new Set(enrichedNotifications.map((n) => n.type)),
  ];

  const importanceOptions = sections.map((s) => ({
    key: s.key,
    label: t(s.label),
  }));

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
    info: filteredNotifications.filter((n) => n.importance === "info"),
  };

  // Map type to color
  const getTypeColor = (typeObj) => {
    // Always use the English value for color mapping
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
        return "var(--neutral-600)"; // fallback color
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
                    key={type.en}
                    className={`doctor-notifications-filter-option caption${
                      selectedTypes.includes(type.en) ? " selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.en)}
                      onChange={() => toggleSelection(type.en)}
                    />
                    {type[i18n.language] || type.en}
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
                        <img
                          src={n.patient?.avatar}
                          alt=""
                          className="doctor-notifications-avatar"
                        />
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
            {sections.slice(2, 4).map(
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
                        <img
                          src={n.patient?.avatar}
                          alt=""
                          className="doctor-notifications-avatar"
                        />
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
      </div>
    </div>
  );
};

export default DoctorNotifications;
