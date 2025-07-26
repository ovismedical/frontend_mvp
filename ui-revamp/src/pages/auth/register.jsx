import React from "react";
import RegisterForm from "../../components/layout/registerForm.jsx";
import Button from "../../components/ui/button.jsx";
import blueLogo from "../../assets/images/logo_blue.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="register-container" data-scale="large">
      <img src={blueLogo} alt="Logo" className="register-image" />

      <h1 className="register-title display">{t("register_title")}</h1>

      <p className="register-subtitle body">{t("register_subtitle")}</p>

      <RegisterForm />

      <Button variant="filled" className="register-button body">
        {t("sign_up")}
      </Button>

      <p className="register-footer caption">
        <span>{t("alreadyHaveAnAccount")}</span>
        <a href="/login" className="login-link caption">
          {t("login")}
        </a>
      </p>
    </div>
  );
};

export default Register;
