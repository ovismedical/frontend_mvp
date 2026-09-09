import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { doctorAPI } from "../../utils/api";

const alertLevelColor = (level) => {
  switch (level) {
    case "RED": return "var(--error-600)";
    case "ORANGE": return "var(--warning-600)";
    case "YELLOW": return "var(--blue-600)";
    case "GREEN": return "var(--success-600)";
    default: return "var(--neutral-600)";
  }
};

const alertLevelLabel = (level) => {
  switch (level) {
    case "RED": return "Critical";
    case "ORANGE": return "Urgent";
    case "YELLOW": return "Caution";
    case "GREEN": return "Stable";
    default: return "No Data";
  }
};

const DoctorPatients = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAlertLevels, setSelectedAlertLevels] = useState([]);
  const [openSections, setOpenSections] = useState({
    alertLevel: false,
  });
  const filterMenuRef = useRef(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await doctorAPI.getPatientDetails();
        if (res?.patients) {
          setPatients(res.patients);
        }
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

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

  const alertLevelOptions = ["RED", "ORANGE", "YELLOW", "GREEN"];

  const toggleAlertLevel = (value) => {
    setSelectedAlertLevels((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedAlertLevels([]);
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredPatients = patients.filter((p) => {
    const name = p.full_name || p.username || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesAlert =
      selectedAlertLevels.length === 0 ||
      selectedAlertLevels.includes(p.latest_alert_level);
    return matchesSearch && matchesAlert;
  });

  const handlePatientClick = (username) => {
    navigate(`/patient_details/${username}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t("no_data");
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t("just_now");
    if (diffMins < 60) return t("min_ago", { count: diffMins });
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24)
      return t(diffHrs === 1 ? "hour_ago" : "hours_ago", { count: diffHrs });
    const diffDays = Math.floor(diffHrs / 24);
    return t(diffDays === 1 ? "day_ago" : "days_ago", { count: diffDays });
  };

  return (
    <div className="doctor-patients-container">
      {/* Header */}
      <div className="doctor-patients-header">
        <span className="material-symbols-rounded"></span>
        <div className="doctor-patients-header h4">{t("patient_list")}</div>
        <span className="material-symbols-rounded"></span>
      </div>

      {/* Search + Filter row */}
      <div className="search-filter-row">
        <div className="search-box ">
          <span className="material-symbols-rounded search-icon">search</span>
          <input
            className="body"
            type="text"
            placeholder={t("search_patients")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-btn-wrap">
          <button
            className={`filter-btn ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <span className="material-symbols-rounded filter-icon">
              filter_list
            </span>
          </button>
        </div>
      </div>

      {/* Filter dropdown */}
      {showFilter && (
        <div className="filter-menu" ref={filterMenuRef}>
          <div className="filter-menu-header">
            <h3 className="filter-menu-header-title h4">{t("filters")}</h3>
            <button className="clear-filters caption" onClick={clearFilters}>
              {t("clear_filters")}
            </button>
          </div>

          {/* Alert Level Section */}
          <div className="filter-section">
            <div
              className="filter-section-header body"
              onClick={() => toggleSection("alertLevel")}
            >
              <span>{t("alert_level")}</span>
              <span className="material-symbols-rounded filter-section-header-icon">
                {openSections.alertLevel ? "expand_less" : "expand_more"}
              </span>
            </div>
            {openSections.alertLevel && (
              <div className="filter-options">
                {alertLevelOptions.map((level) => (
                  <label
                    key={level}
                    className={`filter-option caption${
                      selectedAlertLevels.includes(level) ? " selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAlertLevels.includes(level)}
                      onChange={() => toggleAlertLevel(level)}
                    />
                    {alertLevelLabel(level)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patient List */}
      <div className="patient-list">
        {loading ? (
          <div className="patient-list-loading body">{t("loading")}</div>
        ) : filteredPatients.length === 0 ? (
          <div className="patient-list-empty body">{t("no_patients_found")}</div>
        ) : (
          filteredPatients.map((p) => (
            <div
              key={p.username}
              className="patient-item"
              onClick={() => handlePatientClick(p.username)}
            >
              <div className="patient-avatar patient-avatar--initials">
                {(p.full_name || p.username || "?").trim().charAt(0).toUpperCase() || "?"}
              </div>
              <div className="patient-info">
                <div className="patient-info-row">
                  <span className="patient-name h4">
                    {p.full_name || p.username}
                  </span>
                  <span className="patient-status">
                    <span
                      className="status-dot"
                      style={{
                        backgroundColor: alertLevelColor(p.latest_alert_level),
                      }}
                    ></span>
                    <span className="material-symbols-rounded chevron_forward">
                      chevron_right
                    </span>
                  </span>
                </div>
                <div className="patient-cancer body">
                  {alertLevelLabel(p.latest_alert_level)}
                </div>
                <div className="patient-update caption">
                  {p.last_assessment_date
                    ? t("last_update", { date: formatDate(p.last_assessment_date) })
                    : t("no_assessments_yet")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
