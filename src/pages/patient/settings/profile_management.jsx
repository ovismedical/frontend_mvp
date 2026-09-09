import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/inputfield.jsx";
import Button from "../../../components/ui/button.jsx";
import { authAPI } from "../../../utils/api.js";
import { useAuth } from "../../../context/AuthContext";
import { normalizeUser } from "../../../utils/auth.js";
import { initialsOf } from "../../../utils/timeAgo";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const { user, setUser } = useAuth();

  // Prefer the signed-in user; navigation state only as a fallback
  const userData = {
    email: user?.email || location.state?.email || "",
    userName: user?.name || user?.full_name || location.state?.userName || "",
    phoneNumber: user?.phone || location.state?.phoneNumber || "",
    userImage: location.state?.userImage || "",
  };

  // Helper function to format phone number
  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length > 4) {
      return cleanNumber.slice(0, 4) + " " + cleanNumber.slice(4);
    }
    return cleanNumber;
  };

  // Initialize state with passed data or defaults
  const [Email, setEmail] = useState(userData.email || "");
  const [FullName, setFullName] = useState(userData.userName || "");
  const [MobileNumber, setMobileNumber] = useState(
    formatPhoneNumber(userData.phoneNumber) || ""
  );
  const [ProfileImage, setProfileImage] = useState(userData.userImage || "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  // Keep the form in sync if the session user loads after first render
  useEffect(() => {
    if (!user) return;
    setEmail((v) => v || user.email || "");
    setFullName((v) => v || user.name || user.full_name || "");
    setMobileNumber((v) => v || formatPhoneNumber(user.phone || ""));
  }, [user]);

  // Handle image edit click
  const handleImageEdit = () => {
    fileInputRef.current?.click();
  };

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: t("please_select_valid_image") });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: t("image_size_too_large"),
        });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setMessage({ type: "", text: "" }); // Clear any error messages
      };
      reader.readAsDataURL(file);
      // Backend Handling: Push updated profile image to backend
      // Example: await api.updateProfileImage(file)
    }
  };

  // Handle form submission
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Basic validation (mobile is optional)
    if (!Email || !FullName) {
      setMessage({ type: "error", text: t("fill_required_fields") });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      setMessage({ type: "error", text: t("enter_valid_email") });
      return;
    }

    // Hong Kong mobile number validation (8 digits) when provided
    const cleanNumber = MobileNumber.replace(/\s/g, "");
    const hkMobileRegex = /^[5-9]\d{7}$/; // HK mobile numbers start with 5-9 and are 8 digits
    if (cleanNumber && !hkMobileRegex.test(cleanNumber)) {
      setMessage({ type: "error", text: t("enter_valid_hk_mobile") });
      return;
    }

    setSaving(true);
    try {
      await authAPI.updateUserInfo({ full_name: FullName.trim(), email: Email.trim(), phone: cleanNumber });
      const refreshed = normalizeUser(await authAPI.getUserInfo());
      if (refreshed) setUser(refreshed);
      setMessage({ type: "success", text: t("profile_updated_successfully") });
      setTimeout(() => navigate("/settings", { state: { updated: true } }), 1200);
    } catch (error) {
      setMessage({ type: "error", text: error?.message || t("profile_update_failed") });
    } finally {
      setSaving(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="profile-management-container">
      {/* Header */}
      <div className="profile-management-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="h4">{t("profile_management")}</div>
        <span className="material-symbols-rounded more_vert"></span>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="material-symbols-rounded">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Info Section */}
      <div className="profile-info">
        <div className="profile-avatar">
          {ProfileImage ? (
            <img src={ProfileImage} alt="Profile" />
          ) : (
            <div className="profile-avatar-initials" aria-hidden="true">{initialsOf(FullName || user?.username)}</div>
          )}
          <span
            className="material-symbols-rounded edit-icon"
            onClick={handleImageEdit}
            style={{ cursor: "pointer" }}
          >
            edit
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-details">
          <div className="profile-name body-bold">
            {FullName || t("user_name")}
          </div>
          <div className="profile-email caption">
            {Email || t("user_email")}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="profile-management-content">
        <form
          className="profile-management-fields"
          onSubmit={handleSaveChanges}
        >
          <InputField
            placeholder={t("email_address")}
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<span className="material-symbols-rounded">mail</span>}
            type="email"
            required
          />

          <InputField
            placeholder={t("full_name")}
            value={FullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<span className="material-symbols-rounded">person</span>}
            required
          />

          <InputField
            placeholder={t("mobile_number")}
            value={MobileNumber}
            onChange={(e) => {
              // Remove all non-numeric characters
              let value = e.target.value.replace(/\D/g, "");

              // Limit to 8 digits
              value = value.slice(0, 8);

              // Add space after 4 digits
              if (value.length > 4) {
                value = value.slice(0, 4) + " " + value.slice(4);
              }

              setMobileNumber(value);
            }}
            leftIcon={<span className="material-symbols-rounded">phone</span>}
            type="tel"
            maxLength={9} // 8 digits + 1 space
            required
          />

          {/* Save Button */}
          <div className="profile-management-actions">
            <Button className="update-profile-button" type="submit" disabled={saving}>
              {saving ? t("saving") : t("save_changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
