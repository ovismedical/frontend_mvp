import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputField from "../../components/ui/inputField.jsx";
import Button from "../../components/ui/button.jsx";

const PasswordSecurity = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Separate state for each field
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Separate visibility toggles for new password fields only
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Message state for validation errors
  const [message, setMessage] = useState("");

  const toggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // Basic validation
  const validateForm = () => {
    if (!currentPassword) {
      setMessage(t("current_password_required"));
      return false;
    }
    if (!newPassword) {
      setMessage(t("new_password_required"));
      return false;
    }
    if (newPassword.length < 8) {
      setMessage(t("password_min_length"));
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMessage(t("passwords_do_not_match"));
      return false;
    }

    setMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle password change logic here
      console.log("Password change submitted");
      setMessage(t("password_updated_successfully"));
    }
  };

  const handleResetWithEmail = () => {
    localStorage.removeItem("token");
    navigate("/forgotPassword");
  };

  return (
    <div className="password-security-container">
      <div className="password-security-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="password-security-header h4">
          {t("password_and_security")}
        </div>
        <span className="material-symbols-rounded search"></span>
      </div>
      <div className="password-security-content">
        <form className="password-security-fields" onSubmit={handleSubmit}>
          <InputField
            placeholder={t("current_password")}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            leftIcon={
              <span className="material-symbols-rounded">fingerprint</span>
            }
            type="password"
          />

          <InputField
            placeholder={t("new_password")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={
              <span className="material-symbols-rounded">fingerprint</span>
            }
            rightIcon={
              <span
                className="material-symbols-rounded"
                onClick={toggleShowNewPassword}
              >
                {showNewPassword ? "visibility_off" : "visibility"}
              </span>
            }
            type={showNewPassword ? "text" : "password"}
          />

          <InputField
            placeholder={t("confirm_new_password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={
              <span className="material-symbols-rounded">fingerprint</span>
            }
            rightIcon={
              <span
                className="material-symbols-rounded"
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            }
            type={showConfirmPassword ? "text" : "password"}
          />
          {message && (
            <p className="password-security-message caption">{message}</p>
          )}
        </form>

        <div className="password-security-actions">
          <Button className="update-password-button" onClick={handleSubmit}>
            {t("update_password")}
          </Button>

          <div className="password-security-footer">
            <p className="password-security-footer-text caption">
              {t("dont_remember_password")}
            </p>
            <p
              className="password-security-footer-link caption"
              onClick={handleResetWithEmail}
            >
              {t("reset_password_with_email")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSecurity;
