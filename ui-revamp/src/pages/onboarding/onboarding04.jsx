import React from "react";
import Button from "../../components/ui/button.jsx";
import onboarding04Img from "../../assets/images/onboarding04.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Onboarding04 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="onboarding-container" data-scale="large">
      <div className="onboarding-progress-bar">
        <div
          className="step active"
          onClick={() => navigate("/onboarding01")}
        />
        <div
          className="step active"
          onClick={() => navigate("/onboarding02")}
        />
        <div
          className="step active"
          onClick={() => navigate("/onboarding03")}
        />
        <div className="step active" />
      </div>

      <div className="onboarding-middle-section">
        <h1 className="onboarding-title display">{t("onboarding04_title")}</h1>
        <p className="onboarding-subtitle body">{t("onboarding04_subtitle")}</p>

        <img
          src={onboarding04Img}
          alt="Trusted Wellness Companion"
          className="onboarding-image"
        />
      </div>

      <div className="onboarding-bottom-section">
        <div className="onboarding-button-row">
          <Button variant="outline">{t("skip")}</Button>
          <Button
            variant="filled"
            iconName="arrow_forward"
            iconPosition="right"
            iconFill={1}
          >
            {t("next")}
          </Button>
        </div>

        <p className="onboarding-footer caption">
          {t("onboarding_footer")}
          <a href="#" className="helpCenter-link caption">
            {t("help_center_link")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Onboarding04;
