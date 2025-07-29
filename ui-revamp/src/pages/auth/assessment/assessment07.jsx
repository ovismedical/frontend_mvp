import React from "react";
import ProgressBar from "../../../components/ui/progressbar";
import FitnessLevelSlider from "../../../components/picker/fitnessSlider";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment07 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <span
          className="material-symbols-rounded chevronB_icon"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>

        <div className="progress-bar-container">
          <ProgressBar currentStep={7} totalSteps={9} />
        </div>

        <button className="skip-button" onClick={() => navigate("/home")}>
          {t("skip")}
        </button>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment07_title")}</h1>

        <div className="fitnessSlider-container">
          <FitnessLevelSlider
            onChange={(level) => console.log("Selected level:", level)}
          />
        </div>

        <Button
          variant="filled"
          iconName="arrow_forward"
          iconPosition="right"
          iconFill={1}
          onClick={() => navigate("/assessment08")}
          className="assessment-button body"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment07;
