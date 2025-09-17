import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserCard from "../../../components/ui/userCard.jsx";
import Tabs from "../../../components/ui/tabs.jsx";
import CustomDropdown from "../../../components/ui/dropdown.jsx";
import InviteModal from "../../../components/ui/inviteModal.jsx";

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isModalOpen, setModalOpen] = useState(false);

  // Backend Handling: Fetch user profile data from backend
  const userInfo = {
    userImage:
      "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
    userName: "Linda Wong",
    condition: "Breast Cancer - Stage 2",
    status: "active-treatment",
    phoneNumber: "12345678",
    email: "lindawong@gmail.com",
  };

  const [activeTab, setActiveTab] = useState(t("account"));
  const [helpOpen, setHelpOpen] = useState(false);

  // Add toggle states for Privacy & Data items
  const [dataSharing, setDataSharing] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Add dropdown states for Notifications
  const [checkinReminders, setCheckinReminders] = useState("Daily");
  const [wellnessUpdates, setWellnessUpdates] = useState("Weekly");
  const [doctorMessages, setDoctorMessages] = useState("Immediately");

  // Add state to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Dropdown options with translations
  const checkinOptions = [t("off"), t("daily"), t("every_2_days"), t("weekly")];

  const wellnessOptions = [t("off"), t("daily"), t("weekly"), t("monthly")];

  const messageOptions = [
    t("off"),
    t("immediately"),
    t("hourly_digest"),
    t("daily_digest"),
  ];

  const tabs = [
    { name: t("account") },
    { name: t("privacy_data") },
    { name: t("notifications") },
  ];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setOpenDropdown(null); // Close any open dropdown when switching tabs
  };

  // Helper function to handle dropdown toggles
  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleHealthCareProvider = (e) => {
    e.preventDefault();
    navigate("/healthcare_provider");
  };

  const handlePasswordSecurity = (e) => {
    e.preventDefault();
    navigate("/password_security");
  };

  const handleDisplayLanguage = (e) => {
    e.preventDefault();
    navigate("/display_language");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileManagement = (e) => {
    e.preventDefault();
    // Example: const userData = await api.getUserProfile()
    // Backend Handling: pass userData to navigation state
    navigate("/profile_management", {
      state: {
        userImage: userInfo.userImage,
        userName: userInfo.userName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
      },
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-user-card">
        <UserCard
          userImage={userInfo.userImage}
          userName={userInfo.userName}
          condition={userInfo.condition}
          status={userInfo.status}
          onProfileManagement={handleProfileManagement}
          onQRCodeClick={() => setModalOpen(true)}
        />
      </div>

      <Tabs
        tabs={tabs}
        onTabChange={handleTabChange}
        activeTab={activeTab}
        className="settings-tabs"
      />

      <div className="settings-content">
        {activeTab === t("account") && (
          <div className="account-settings-list">
            <div className="settings-item" onClick={handleHealthCareProvider}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  medical_information
                </span>
                <span className="settings-item-text body">
                  {t("healthcare_provider")}
                </span>
              </div>
              <span className="material-symbols-rounded arrow">
                chevron_right
              </span>
            </div>

            <div className="settings-item" onClick={handlePasswordSecurity}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  encrypted
                </span>
                <span className="settings-item-text body">
                  {t("password_security")}
                </span>
              </div>
              <span className="material-symbols-rounded arrow">
                chevron_right
              </span>
            </div>

            <div className="settings-item" onClick={handleDisplayLanguage}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  settings_motion_mode
                </span>
                <span className="settings-item-text body">
                  {t("display_language")}
                </span>
              </div>
              <span className="material-symbols-rounded arrow">
                chevron_right
              </span>
            </div>
          </div>
        )}

        {activeTab === t("privacy_data") && (
          <div className="privacy-settings-list">
            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  groups
                </span>
                <div className="settings-item-textwrap">
                  <span className="settings-item-text body">
                    {t("data_sharing_provider")}
                  </span>
                  <span className="settings-item-subtext caption">
                    {t("data_sharing_provider_desc")}
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => {
                    setDataSharing(e.target.checked);
                    // Backend Handling: Push data sharing preference to backend
                    // Example: await api.updatePreference('dataSharing', e.target.checked)
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  bar_chart_4_bars
                </span>
                <div className="settings-item-textwrap">
                  <span className="settings-item-text body">
                    {t("anonymous_analytics")}
                  </span>
                  <span className="settings-item-subtext caption">
                    {t("anonymous_analytics_desc")}
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => {
                    setAnalytics(e.target.checked);
                    // Backend Handling: Push analytics preference to backend
                    // Example: await api.updatePreference('analytics', e.target.checked)
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  mark_as_unread
                </span>
                <div className="settings-item-textwrap">
                  <span className="settings-item-text body">
                    {t("marketing_communications")}
                  </span>
                  <span className="settings-item-subtext caption">
                    {t("marketing_communications_desc")}
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => {
                    setMarketing(e.target.checked);
                    // Backend Handling: Push marketing preference to backend
                    // Example: await api.updatePreference('marketing', e.target.checked)
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === t("notifications") && (
          <div className="notification-settings-list">
            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  notifications_active
                </span>
                <span className="settings-item-text body">
                  {t("checkin_reminders")}
                </span>
              </div>
              <CustomDropdown
                options={checkinOptions}
                value={t(
                  checkinReminders
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/\d+/g, (match) => match)
                )}
                onChange={(value) => {
                  // Map translated value back to internal value
                  const optionMap = {
                    [t("off")]: "Off",
                    [t("daily")]: "Daily",
                    [t("every_2_days")]: "Every 2 days",
                    [t("weekly")]: "Weekly",
                  };
                  setCheckinReminders(optionMap[value] || value);
                  // Backend Handling: Push check-in reminder preference to backend
                  // Example: await api.updatePreference('checkinReminders', optionMap[value] || value)
                }}
                className="settings-custom-dropdown"
                isOpen={openDropdown === "checkin"}
                onToggle={() => handleDropdownToggle("checkin")}
              />
            </div>

            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  stars_2
                </span>
                <span className="settings-item-text body">
                  {t("wellness_score_updates")}
                </span>
              </div>
              <CustomDropdown
                options={wellnessOptions}
                value={t(wellnessUpdates.toLowerCase())}
                onChange={(value) => {
                  const optionMap = {
                    [t("off")]: "Off",
                    [t("daily")]: "Daily",
                    [t("weekly")]: "Weekly",
                    [t("monthly")]: "Monthly",
                  };
                  setWellnessUpdates(optionMap[value] || value);
                  // Backend Handling: Push wellness update preference to backend
                  // Example: await api.updatePreference('wellnessUpdates', optionMap[value] || value)
                }}
                className="settings-custom-dropdown"
                isOpen={openDropdown === "wellness"}
                onToggle={() => handleDropdownToggle("wellness")}
              />
            </div>

            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  chat
                </span>
                <span className="settings-item-text body">
                  {t("doctor_messages")}
                </span>
              </div>
              <CustomDropdown
                options={messageOptions}
                value={t(doctorMessages.toLowerCase().replace(/ /g, "_"))}
                onChange={(value) => {
                  const optionMap = {
                    [t("off")]: "Off",
                    [t("immediately")]: "Immediately",
                    [t("hourly_digest")]: "Hourly digest",
                    [t("daily_digest")]: "Daily digest",
                  };
                  setDoctorMessages(optionMap[value] || value);
                  // Backend Handling: Push doctor message notification preference to backend
                  // Example: await api.updatePreference('doctorMessages', optionMap[value] || value)
                }}
                className="settings-custom-dropdown"
                isOpen={openDropdown === "messages"}
                onToggle={() => handleDropdownToggle("messages")}
              />
            </div>
          </div>
        )}

        {/* Help & Support Accordion - Available under all tabs */}
        <div className="common-settings-list">
          <div
            className={`settings-item help ${helpOpen ? "open" : ""}`}
            onClick={() => setHelpOpen(!helpOpen)}
          >
            <div className="settings-left">
              <span className="material-symbols-rounded settings-icon">
                help
              </span>
              <span className="settings-item-text help-support body">
                {t("help_support")}
              </span>
            </div>
            <span className="material-symbols-rounded arrow">
              {helpOpen ? "expand_less" : "expand_more"}
            </span>
          </div>

          {helpOpen && (
            <div className="help-subtext-content">
              <p className="help-subtext body">{t("help_description_1")}</p>

              <p className="help-subtext body">
                {t("help_description_2")}{" "}
                <a href="mailto:support@ovismedical.com" className="help-link">
                  {t("support_email")}
                </a>{" "}
                {t("help_description_3")}
              </p>

              <p className="help-subtext body">
                {t("help_description_4")}{" "}
                <a
                  href="#"
                  className="help-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/help_center");
                  }}
                >
                  {t("help_center")}
                </a>
                .
              </p>

              <p className="help-subtext body">{t("help_description_5")}</p>
            </div>
          )}

          <div className="settings-item logout" onClick={handleLogout}>
            <div className="settings-left">
              <span className="material-symbols-rounded settings-icon">
                chip_extraction
              </span>
              <span className="settings-item-text logout body">
                {t("logout")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userName={userInfo.userName}
        inviteLink={`invite://ovisapp.com/connect?token=XYZ123`}
      />
    </div>
  );
};

export default Settings;
