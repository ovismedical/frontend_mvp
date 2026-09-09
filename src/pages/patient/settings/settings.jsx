import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserCard from "../../../components/ui/userCard.jsx";
import Tabs from "../../../components/ui/tabs.jsx";
import CustomDropdown from "../../../components/ui/dropdown.jsx";
import InviteModal from "../../../components/ui/inviteModal.jsx";
import { authAPI } from "../../../utils/api.js";
import { useAuth } from "../../../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userImage: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
    userName: "",
    condition: "",
    status: "active-treatment",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(t("account"));
  const [helpOpen, setHelpOpen] = useState(false);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await authAPI.getUserInfo();
        
        // Update user info with fetched data
        const doctorLine = userData.doctor_info?.full_name
          ? `${userData.doctor_info.full_name}${userData.doctor_info.hospital ? " · " + userData.doctor_info.hospital : ""}`
          : userData.doctor_name || "";
        setUserInfo({
          userImage: "",
          userName: userData.full_name || userData.username || "User",
          condition: doctorLine || t("no_doctor_assigned"),
          status: userData.treatment_status === "in_remission" ? "in-remission" : "active-treatment",
          phoneNumber: userData.phone || userData.phoneNumber || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileManagement = (e) => {
    e.preventDefault();
    // Example: const userData = await api.getUserProfile()
    // Backend Handling: pass userData to navigation state
    navigate("/profile_management", {
      state: {
        full_name: userInfo.userName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        condition: userInfo.condition,
      },
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-user-card">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{t("loading") || "Loading user data..."}</p>
          </div>
        ) : (
          <UserCard
            userImage={userInfo.userImage}
            userName={userInfo.userName}
            condition={userInfo.condition}
            status={userInfo.status}
            onProfileManagement={handleProfileManagement}
            onQRCodeClick={() => setModalOpen(true)}
          />
        )}
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
            <button type="button" className="settings-item" onClick={handleHealthCareProvider}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                  medical_information
                </span>
                <span className="settings-item-text body">
                  {t("healthcare_provider")}
                </span>
              </div>
              <span className="material-symbols-rounded arrow" aria-hidden="true">
                chevron_right
              </span>
            </button>

            <button type="button" className="settings-item" onClick={handlePasswordSecurity}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                  encrypted
                </span>
                <span className="settings-item-text body">
                  {t("password_security")}
                </span>
              </div>
              <span className="material-symbols-rounded arrow" aria-hidden="true">
                chevron_right
              </span>
            </button>

            <button type="button" className="settings-item" onClick={handleDisplayLanguage}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                  settings_motion_mode
                </span>
                <span className="settings-item-text body">
                  {t("display_language")}
                </span>
              </div>
              <span className="material-symbols-rounded arrow" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>
        )}

        {activeTab === t("privacy_data") && (
          <div className="privacy-settings-list">
            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
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
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
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
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
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
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
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
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
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
                <span className="material-symbols-rounded settings-icon" aria-hidden="true">
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
          <button type="button"
            className={`settings-item help ${helpOpen ? "open" : ""}`}
            onClick={() => setHelpOpen(!helpOpen)}
          >
            <div className="settings-left">
              <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                help
              </span>
              <span className="settings-item-text help-support body">
                {t("help_support")}
              </span>
            </div>
            <span className="material-symbols-rounded arrow" aria-hidden="true">
              {helpOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

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

          <button type="button" className="settings-item logout" onClick={handleLogout}>
            <div className="settings-left">
              <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                chip_extraction
              </span>
              <span className="settings-item-text logout body">
                {t("logout")}
              </span>
            </div>
          </button>
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
