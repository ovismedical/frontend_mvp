import React from "react";
import InputField from "../../components/ui/inputfield.jsx";
import Button from "../../components/ui/button.jsx";
import forgotPassImg from "../../assets/images/forgot_password.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="forgotPassword-container" data-scale="large">
      <div className="backIcon-container">
        <span
          className="material-symbols-rounded chevronB_icon"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
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
