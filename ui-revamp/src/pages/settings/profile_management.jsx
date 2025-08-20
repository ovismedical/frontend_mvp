import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputField from "../../components/ui/inputField.jsx";
import Button from "../../components/ui/button.jsx";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  // Get data from navigation state or use defaults
  const userData = location.state || {};

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
    }
  };

  // Handle form submission
  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Basic validation
    if (!Email || !FullName || !MobileNumber) {
      setMessage({ type: "error", text: t("fill_required_fields") });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      setMessage({ type: "error", text: t("enter_valid_email") });
      return;
    }

    // Hong Kong mobile number validation (8 digits)
    const cleanNumber = MobileNumber.replace(/\s/g, "");
    const hkMobileRegex = /^[5-9]\d{7}$/; // HK mobile numbers start with 5-9 and are 8 digits

    if (!hkMobileRegex.test(cleanNumber)) {
      setMessage({
        type: "error",
        text: t("enter_valid_hk_mobile"),
      });
      return;
    }

    // If all validation passes, show success and navigate back
    setMessage({ type: "success", text: t("profile_updated_successfully") });

    // Navigate back to settings after a short delay
    setTimeout(() => {
      navigate("/settings", {
        state: {
          updated: true,
          userData: {
            email: Email,
            userName: FullName,
            phoneNumber: cleanNumber, // Store without space
            userImage: ProfileImage,
          },
        },
      });
    }, 1500);
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
          <img src={ProfileImage || "/default-avatar.png"} alt="Profile" />
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
            <Button className="update-profile-button" type="submit">
              {t("save_changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
