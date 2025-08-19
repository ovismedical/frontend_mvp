import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/ui/inputField.jsx";
import Button from "../../components/ui/button.jsx";

const PasswordSecurity = () => {
  const navigate = useNavigate();

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
      setMessage("Current password is required");
      return false;
    }
    if (!newPassword) {
      setMessage("New password is required");
      return false;
    }
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
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
      setMessage("Password updated successfully!");
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
        <div className="password-security-header h4">Password and Security</div>
        <span className="material-symbols-rounded search"></span>
      </div>
      <div className="password-security-content">
        <form className="password-security-fields" onSubmit={handleSubmit}>
          <InputField
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            leftIcon={
              <span className="material-symbols-rounded">fingerprint</span>
            }
            type="password"
          />

          <InputField
            placeholder="New Password"
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
            placeholder="Confirm New Password"
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
            Update Password
          </Button>

          <div className="password-security-footer">
            <p className="password-security-footer-text caption">
              Don't remember your current password?
            </p>
            <p className="password-security-footer-link caption" onClick={handleResetWithEmail}>
              Reset Password with Email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSecurity;
