import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../../components/ui/tabs";
import MedicationList from "../../components/layout/medication_list";

const Medication = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(t("active"));
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const tabs = [{ name: t("active") }, { name: t("archived") }];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  return (
    <div className="med-list-container">
      <div className="med-list-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="med-list-header h4">{t("all_medications")}</div>
        <span
          className="material-symbols-rounded search"
          onClick={toggleSearch}
          style={{ cursor: "pointer" }}
        >
          search
        </span>
      </div>

      {isSearchVisible && (
        <div className="med-search-input-container">
          <input
            className="body"
            type="text"
            placeholder={t("search_medications")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <Tabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
      <MedicationList activeTab={activeTab} searchTerm={searchTerm} />
    </div>
  );
};

export default Medication;
