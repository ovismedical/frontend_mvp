import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import patientsData from "../../data/patients.json";

const stageColor = (stageObj) => {
  const stage = typeof stageObj === "string" ? stageObj : stageObj?.en || "";
  // Positive outcome
  if (
    stage === "NED" ||
    stage.includes("Remission") ||
    stage.includes("Survivorship")
  )
    return "var(--success-600)";

  // Severe / advanced
  if (
    stage.includes("Stage IV") ||
    stage.includes("Refractory") ||
    stage.includes("End-of-Life") ||
    stage.includes("Palliative")
  )
    return "var(--error-600)";

  // Medium–high risk / advancing
  if (
    stage.includes("Stage III") ||
    stage.includes("Progressive") ||
    stage.includes("Relapse") ||
    stage.includes("Recurrence")
  )
    return "var(--warning-600)";

  // Early stage (informational)
  if (
    stage.includes("Stage 0") ||
    stage.includes("Stage I") ||
    stage.includes("Stage II") ||
    stage.includes("Diagnostic") ||
    stage.includes("Staging Phase")
  )
    return "var(--blue-600)";

  // Active/ongoing management (not remission but not severe)
  if (
    stage.includes("Acute Phase") ||
    stage.includes("Chronic Phase") ||
    stage.includes("Maintenance") ||
    stage.includes("Follow-up")
  )
    return "var(--lavender-600)";

  // Default
  return "var(--neutral-600)";
};

const DoctorPatients = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCancers, setSelectedCancers] = useState([]);
  const [selectedStages, setSelectedStages] = useState([]);
  const [openSections, setOpenSections] = useState({
    cancer: false,
    stage: false,
  });
  const filterMenuRef = useRef(null);

  useEffect(() => {
    setPatients(patientsData);
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

  // Unique cancer types and stages (objects)
  const cancerTypes = [
    ...new Map(patientsData.map((p) => [p.cancer.en, p.cancer])).values(),
  ];
  const stages = [
    ...new Map(patientsData.map((p) => [p.stage.en, p.stage])).values(),
  ];

  const toggleSelection = (value, setFunc, state) => {
    if (state.includes(value)) {
      setFunc(state.filter((v) => v !== value));
    } else {
      setFunc([...state, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCancers([]);
    setSelectedStages([]);
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCancer =
      selectedCancers.length === 0 || selectedCancers.includes(p.cancer.en);
    const matchesStage =
      selectedStages.length === 0 || selectedStages.includes(p.stage.en);
    return matchesSearch && matchesCancer && matchesStage;
  });

  const handlePatientClick = (id) => {
    navigate(`/patient_details/${id}`);
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

          {/* Cancer Type Section */}
          <div className="filter-section">
            <div
              className="filter-section-header body"
              onClick={() => toggleSection("cancer")}
            >
              <span>{t("cancer_type")}</span>
              <span className="material-symbols-rounded filter-section-header-icon">
                {openSections.cancer ? "expand_less" : "expand_more"}
              </span>
            </div>
            {openSections.cancer && (
              <div className="filter-options">
                {cancerTypes.map((type) => (
                  <label
                    key={type.en}
                    className={`filter-option caption${
                      selectedCancers.includes(type.en) ? " selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCancers.includes(type.en)}
                      onChange={() =>
                        toggleSelection(
                          type.en,
                          setSelectedCancers,
                          selectedCancers
                        )
                      }
                    />
                    {type[i18n.language] || type.en}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Stage Section */}
          <div className="filter-section">
            <div
              className="filter-section-header body"
              onClick={() => toggleSection("stage")}
            >
              <span>{t("stage")}</span>
              <span className="material-symbols-rounded filter-section-header-icon">
                {openSections.stage ? "expand_less" : "expand_more"}
              </span>
            </div>
            {openSections.stage && (
              <div className="filter-options">
                {stages.map((stage) => (
                  <label
                    key={stage.en}
                    className={`filter-option caption${
                      selectedStages.includes(stage.en) ? " selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStages.includes(stage.en)}
                      onChange={() =>
                        toggleSelection(
                          stage.en,
                          setSelectedStages,
                          selectedStages
                        )
                      }
                    />
                    {stage[i18n.language] || stage.en}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patient List */}
      <div className="patient-list">
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className="patient-item"
            onClick={() => handlePatientClick(p.id)}
          >
            <img src={p.avatar} alt={p.name} className="patient-avatar" />
            <div className="patient-info">
              <div className="patient-info-row">
                <span className="patient-name h4">{p.name}</span>
                <span className="patient-status">
                  <span
                    className="status-dot"
                    style={{ backgroundColor: stageColor(p.stage) }}
                  ></span>
                  <span className="material-symbols-rounded chevron_forward">
                    chevron_right
                  </span>
                </span>
              </div>
              <div className="patient-cancer body">
                {p.cancer[i18n.language] || p.cancer.en} -{" "}
                {p.stage[i18n.language] || p.stage.en}
              </div>
              <div className="patient-update caption">
                {t("last_update", { date: p.lastUpdate })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPatients;
