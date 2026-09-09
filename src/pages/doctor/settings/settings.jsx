import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "../../../components/ui/tabs.jsx";
import CustomDropdown from "../../../components/ui/dropdown.jsx";
import InviteModal from "../../../components/ui/inviteModal.jsx";
import { useAuth } from "../../../context/AuthContext";
import { initialsOf } from "../../../utils/timeAgo";

const DoctorSettings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isModalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const userInfo = {
    userImage: null,
    userName: user?.name || t("doctor"),
    department: [user?.specialty, user?.hospital].filter(Boolean).join(" · ") || t("clinician"),
    phoneNumber: user?.phone || "",
    email: user?.email || "",
    accessCode: user?.code || "",
  };

  const [activeTab, setActiveTab] = useState(t("account"));
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const [checkinReminders, setCheckinReminders] = useState(t("hourly_digest"));
  const [wellnessUpdates, setWellnessUpdates] = useState(t("weekly"));
  const [doctorMessages, setDoctorMessages] = useState(t("immediately"));

  const [openDropdown, setOpenDropdown] = useState(null);

  const checkinOptions = [
    t("off"),
    t("immediately"),
    t("hourly_digest"),
    t("daily_digest"),
  ];

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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
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
    logout();
    navigate("/login");
  };

  const handleProfileManagement = (e) => {
    e.preventDefault();
    navigate("/profile_management", {
      state: {
        userImage: userInfo.userImage,
        userName: userInfo.userName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
      },
    });
  };

  const accountItems = [
    {
      key: "profile_management",
      icon: "person_edit",
      onClick: handleProfileManagement,
      label: t("profile_management"),
    },
    {
      key: "password_security",
      icon: "encrypted",
      onClick: handlePasswordSecurity,
      label: t("password_security"),
    },
    {
      key: "display_language",
      icon: "settings_motion_mode",
      onClick: handleDisplayLanguage,
      label: t("display_language"),
    },
  ];

  const privacyItems = [
    {
      key: "anonymous_analytics",
      icon: "bar_chart_4_bars",
      label: t("anonymous_analytics"),
      desc: t("anonymous_analytics_desc"),
      checked: analytics,
      onChange: setAnalytics,
    },
    {
      key: "marketing_communications",
      icon: "mark_as_unread",
      label: t("marketing_communications"),
      desc: t("marketing_communications_desc"),
      checked: marketing,
      onChange: setMarketing,
    },
  ];

  const notificationItems = [
    {
      key: "patient_alerts",
      icon: "notifications_active",
      label: t("patient_alerts"),
      dropdown: {
        options: checkinOptions,
        value: t(
          checkinReminders
            .toLowerCase()
            .replace(/ /g, "_")
            .replace(/\d+/g, (match) => match)
        ),
        onChange: (value) => {
          const optionMap = {
            [t("off")]: "Off",
            [t("immediately")]: "Immediately",
            [t("hourly_digest")]: "Hourly digest",
            [t("daily_digest")]: "Daily digest",
          };
          setCheckinReminders(optionMap[value] || value);
        },
        isOpen: openDropdown === "checkin",
        onToggle: () => handleDropdownToggle("checkin"),
      },
    },
    {
      key: "medication_reminders",
      icon: "stars_2",
      label: t("medication_reminders"),
      dropdown: {
        options: wellnessOptions,
        value: t(wellnessUpdates.toLowerCase()),
        onChange: (value) => {
          const optionMap = {
            [t("off")]: "Off",
            [t("daily")]: "Daily",
            [t("weekly")]: "Weekly",
            [t("monthly")]: "Monthly",
          };
          setWellnessUpdates(optionMap[value] || value);
        },
        isOpen: openDropdown === "wellness",
        onToggle: () => handleDropdownToggle("wellness"),
      },
    },
    {
      key: "new_report",
      icon: "clinical_notes",
      label: t("new_report"),
      dropdown: {
        options: messageOptions,
        value: t(doctorMessages.toLowerCase().replace(/ /g, "_")),
        onChange: (value) => {
          const optionMap = {
            [t("off")]: "Off",
            [t("immediately")]: "Immediately",
            [t("hourly_digest")]: "Hourly digest",
            [t("daily_digest")]: "Daily digest",
          };
          setDoctorMessages(optionMap[value] || value);
        },
        isOpen: openDropdown === "messages",
        onToggle: () => handleDropdownToggle("messages"),
      },
    },
  ];

  const lowerSearch = searchTerm.toLowerCase();

  const filteredAccountItems = accountItems.filter((item) =>
    item.label.toLowerCase().includes(lowerSearch)
  );

  const filteredPrivacyItems = privacyItems.filter(
    (item) =>
      item.label.toLowerCase().includes(lowerSearch) ||
      item.desc.toLowerCase().includes(lowerSearch)
  );

  const filteredNotificationItems = notificationItems.filter((item) =>
    item.label.toLowerCase().includes(lowerSearch)
  );

  const showHelp =
    !searchTerm ||
    t("help_support").toLowerCase().includes(lowerSearch) ||
    t("help_description_1").toLowerCase().includes(lowerSearch) ||
    t("help_description_2").toLowerCase().includes(lowerSearch) ||
    t("help_description_3").toLowerCase().includes(lowerSearch) ||
    t("help_description_4").toLowerCase().includes(lowerSearch) ||
    t("help_description_5").toLowerCase().includes(lowerSearch);

  const showLogout =
    !searchTerm || t("logout").toLowerCase().includes(lowerSearch);

  return (
    <div className="settings-container">
      <div className="settings-doctor-header">
        <div className="settings-doctor-left">
          <div className="settings-doctor-avatar settings-doctor-avatar--initials" aria-hidden="true">
            {initialsOf(userInfo.userName)}
          </div>
          <div className="settings-doctor-info">
            <h2 className="settings-doctor-name h4">{userInfo.userName}</h2>
            <p className="settings-doctor-department body">
              {userInfo.department}
            </p>
          </div>
        </div>
        <div className="settings-doctor-search" onClick={toggleSearch}>
          <span className="material-symbols-rounded doctor-header-icon" aria-hidden="true">
            search
          </span>
        </div>
      </div>

      {isSearchVisible && (
        <div className="settings-search-input-container">
          <input
            className="body"
            type="text"
            placeholder="Search settings"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <Tabs
        tabs={tabs}
        onTabChange={handleTabChange}
        activeTab={activeTab}
        className="settings-tabs"
      />

      <div className="settings-content">
        {activeTab === t("account") && (
          <div className="account-settings-list">
            {filteredAccountItems.length === 0 && searchTerm ? (
              <div className="settings-no-results">
                {t("no_results_found")} "{searchTerm}".
              </div>
            ) : (
              filteredAccountItems.map((item) => (
                <button type="button"
                  className="settings-item"
                  onClick={item.onClick}
                  key={item.key}
                >
                  <div className="settings-left">
                    <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="settings-item-text body">
                      {item.label}
                    </span>
                  </div>
                  <span className="material-symbols-rounded arrow" aria-hidden="true">
                    chevron_right
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === t("privacy_data") && (
          <div className="privacy-settings-list">
            {filteredPrivacyItems.length === 0 && searchTerm ? (
              <div className="settings-no-results">
                {t("no_results_found")} "{searchTerm}".
              </div>
            ) : (
              filteredPrivacyItems.map((item) => (
                <div className="settings-item" key={item.key}>
                  <div className="settings-left">
                    <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div className="settings-item-textwrap">
                      <span className="settings-item-text body">
                        {item.label}
                      </span>
                      <span className="settings-item-subtext caption">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === t("notifications") && (
          <div className="notification-settings-list">
            {filteredNotificationItems.length === 0 && searchTerm ? (
              <div className="settings-no-results">
                {t("no_results_found")} "{searchTerm}".
              </div>
            ) : (
              filteredNotificationItems.map((item) => (
                <div className="settings-item" key={item.key}>
                  <div className="settings-left">
                    <span className="material-symbols-rounded settings-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="settings-item-text body">
                      {item.label}
                    </span>
                  </div>
                  <CustomDropdown
                    options={item.dropdown.options}
                    value={item.dropdown.value}
                    onChange={item.dropdown.onChange}
                    className="settings-custom-dropdown"
                    isOpen={item.dropdown.isOpen}
                    onToggle={item.dropdown.onToggle}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Help & Support Accordion - Available under all tabs */}
        <div className="common-settings-list">
          {showHelp && (
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
          )}

          {helpOpen && showHelp && (
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

          {showLogout && (
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
          )}
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

export default DoctorSettings;
