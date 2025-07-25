import React from "react";
import Button from "../../components/ui/button.jsx";
import welcomeImg from "../../assets/images/welcome_screen.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  ////* changeLanguage testing *////
  
  // const { i18n } = useTranslation();

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };

  return (
    <div className="welcome-container" data-scale="large">
      <img src={welcomeImg} alt="Welcome" className="welcome-image" />
      <h1 className="welcome-title display">{t("welcome_title")}</h1>
      <p className="welcome-subtitle body">{t("welcome_subtitle")}</p>
      <Button
        variant="filled"
        iconName="arrow_forward"
        iconPosition="right"
        iconFill={1}
        onClick={() => navigate("/onboarding01")}
        className="welcome-button body"
      >
        {t("get_started")}
      </Button>
      <p className="welcome-footer caption">
        {t("alreadyHaveAnAccount")}
        <a href="/login" className="login-link caption">
          {t("login")}
        </a>
      </p>

      {/* <div className="language-switch">
        <p
          className="welcome-footer caption"
          onClick={() => changeLanguage("en")}
        >
          eng
        </p>
        <p
          className="welcome-footer caption"
          onClick={() => changeLanguage("zh")}
        >
          中
        </p>
      </div> */}
    </div>
  );
};

export default WelcomeScreen;
