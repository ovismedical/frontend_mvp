import React from "react";
import InputField from "../../components/ui/inputfield.jsx";
import Button from "../../components/ui/button.jsx";
import forgotPassImg from "../../assets/images/forgot_password.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StatusBanner from "../../components/ui/statusBanner";
import BackButton from "../../components/ui/backButton";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Backend Handling: Password reset request should be sent to backend API when user submits email
  return (
    <div className="forgotPassword-container">
      <StatusBanner variant="coming-soon" message={t("password_coming_soon")} />
      <div className="backIcon-container">
        <BackButton className="chevronB_icon" onClick={() => navigate("/login")} />
      </div>

      <img
        src={forgotPassImg}
        alt="Forgot Password Illustration"
        className="forgotPassword-image"
      />

      <h1 className="forgotPassword-title display">
        {t("forgotPassword_title")}
      </h1>

      <p className="forgotPassword-subtitle body">
        {t("forgotPassword_subtitle")}
      </p>

      <InputField
        placeholder="Email Address"
        leftIcon={<span className="material-symbols-rounded">mail</span>}
      />

      <Button
        variant="filled"
        iconName="arrow_forward"
        iconPosition="right"
        iconFill={1}
        onClick={() => navigate("/passwordLink")}
        className="forgotPassword-button body"
      >
        {t("forgotPassword_button")}
      </Button>

      <div className="forgotPassword-footer caption">
        <p>{t("forgotPassword_footer")}</p>
        <p>
          <span>{t("contactUs")}</span>
          <a
            href={`mailto:${t("supportEmail")}`}
            className="email-link caption"
          >
            {t("supportEmail")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
