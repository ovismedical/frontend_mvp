import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "../../components/ui/userCard.jsx";
import Tabs from "../../components/ui/tabs.jsx";
import CustomDropdown from "../../components/ui/dropdown.jsx";
import InviteModal from "../../components/ui/inviteModal.jsx";

const Settings = () => {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);

  // User information constant
  const userInfo = {
    userImage:
      "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
    userName: "Linda Wong",
    condition: "Breast Cancer - Stage 2",
    status: "active-treatment",
    phoneNumber: "12345678",
    email: "lindawong@gmail.com",
  };

  const [activeTab, setActiveTab] = useState("Account");
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

  // Dropdown options
  const checkinOptions = ["Off", "Daily", "Every 2 days", "Weekly"];
  const wellnessOptions = ["Off", "Daily", "Weekly", "Monthly"];
  const messageOptions = [
    "Off",
    "Immediately",
    "Hourly digest",
    "Daily digest",
  ];

  const tabs = [
    { name: "Account" },
    { name: "Privacy & Data" },
    { name: "Notifications" },
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
    navigate("/profile_management", {
      state: {
        userImage: userInfo.userImage,
        userName: userInfo.userName,
        email: userInfo.email, // Add email to userInfo
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
        {activeTab === "Account" && (
          <div className="account-settings-list">
            <div className="settings-item" onClick={handleHealthCareProvider}>
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  medical_information
                </span>
                <span className="settings-item-text body">
                  Healthcare Provider
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
                  Password & Security
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
                  Display & Language
                </span>
              </div>
              <span className="material-symbols-rounded arrow">
                chevron_right
              </span>
            </div>
          </div>
        )}

        {activeTab === "Privacy & Data" && (
          <div className="privacy-settings-list">
            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  groups
                </span>
                <div className="settings-item-textwrap">
                  <span className="settings-item-text body">
                    Data Sharing with Provider
                  </span>
                  <span className="settings-item-subtext caption">
                    Allow your healthcare provider to access your wellness data
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => setDataSharing(e.target.checked)}
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
                    Anonymous Analytics
                  </span>
                  <span className="settings-item-subtext caption">
                    Help improve Ovis by sharing anonymized usage data
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
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
                    Marketing Communications
                  </span>
                  <span className="settings-item-subtext caption">
                    Receive emails about new features and health tips
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="notification-settings-list">
            <div className="settings-item">
              <div className="settings-left">
                <span className="material-symbols-rounded settings-icon">
                  notifications_active
                </span>
                <span className="settings-item-text body">
                  Check-in Reminders
                </span>
              </div>
              <CustomDropdown
                options={checkinOptions}
                value={checkinReminders}
                onChange={setCheckinReminders}
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
                  Wellness Score Updates
                </span>
              </div>
              <CustomDropdown
                options={wellnessOptions}
                value={wellnessUpdates}
                onChange={setWellnessUpdates}
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
                <span className="settings-item-text body">Doctor Messages</span>
              </div>
              <CustomDropdown
                options={messageOptions}
                value={doctorMessages}
                onChange={setDoctorMessages}
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
                Help & Support
              </span>
            </div>
            <span className="material-symbols-rounded arrow">
              {helpOpen ? "expand_less" : "expand_more"}
            </span>
          </div>

          {helpOpen && (
            <div className="help-subtext-content">
              <p className="help-subtext body">
                We're here to make sure you have the best possible experience.
                If you have any questions, encounter an issue, or would like to
                share feedback, please don't hesitate to get in touch.
              </p>

              <p className="help-subtext body">
                You can reach us directly at{" "}
                <a
                  href="mailto:support@ovismedical.com?subject=App%20Support%20Request"
                  className="help-link"
                >
                  support@ovismedical.com
                </a>{" "}
                and our team will get back to you as soon as possible.
              </p>

              <p className="help-subtext body">
                For quick answers to common questions, step-by-step guides, and
                troubleshooting tips, visit our{" "}
                <a href="/help_center" className="help-link">
                  Help Center
                </a>
                .
              </p>

              <p className="help-subtext body">
                Your feedback is invaluable to us, it helps us improve and
                continue building a service that supports you every step of the
                way.
              </p>
            </div>
          )}

          <div className="settings-item logout" onClick={handleLogout}>
            <div className="settings-left">
              <span className="material-symbols-rounded settings-icon">
                chip_extraction
              </span>
              <span className="settings-item-text logout body">Logout</span>
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
