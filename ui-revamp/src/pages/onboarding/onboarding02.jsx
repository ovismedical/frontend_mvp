import React from "react";
import Button from "../../components/ui/button.jsx";
import onboarding02Img from "../../assets/images/onboarding02.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Onboarding02 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="onboarding-container" data-scale="large">
      <div className="onboarding-progress-bar">
        <div
          className="step active"
          onClick={() => navigate("/onboarding01")}
        />
        <div className="step active" />
        <div className="step" />
        <div className="step" />
      </div>

      <div className="onboarding-middle-section">
        <h1 className="onboarding-title display">
          {" "}
          {t("onboarding02_title")}{" "}
        </h1>
        <p className="onboarding-subtitle body">{t("onboarding02_subtitle")}</p>

        <img
          src={onboarding02Img}
          alt="AI-Powered Symptom Logger"
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
            onClick={() => navigate("/onboarding03")}
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

export default Onboarding02;
