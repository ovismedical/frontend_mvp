import React from "react";
import LoginForm from "../../components/layout/loginForm.jsx";
import Button from "../../components/ui/button.jsx";
import blueLogo from "../../assets/images/logo_blue.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="login-container" data-scale="large">
      <img src={blueLogo} alt="Logo" className="login-image" />

      <h1 className="login-title display">{t("login_title")}</h1>

      <p className="login-subtitle body">{t("login_subtitle")}</p>

      <LoginForm />

      <Button variant="filled" className="login-button body">
        {t("log_in")}
      </Button>

      <a href="/forgotPassword" className="login-forgot-password caption">
        {t("forgotPassword")}
      </a>

      <p className="login-footer caption">
        <span>{t("alreadyHaveAnAccount")}</span>
        <a href="/register" className="login-link caption">
          {t("register")}
        </a>
      </p>
    </div>
  );
};

export default Login;
