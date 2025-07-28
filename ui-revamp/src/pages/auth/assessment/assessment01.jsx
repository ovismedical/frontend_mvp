import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import InputField from "../../../components/ui/inputfield";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment01 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (name.trim() === "") {
      setError(true);
    } else {
      setError(false);
      navigate("/assessment02");
    }
  };

  return (
    <div className="assessment-container" data-scale="large">
      <div className="assessment-header">
        <span
          className="material-symbols-rounded chevronB_icon"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>

        <div className="progress-bar-container">
          <ProgressBar currentStep={1} totalSteps={9} />
        </div>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment01_title")}</h1>

        <p className="assessment-subtitle h4">{t("assessment01_subtitle")}</p>

        <InputField
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<span className="material-symbols-rounded">person</span>}
        />

        {error && name.trim() === "" && (
          <span className="error-message visible caption">
            Full Name is required
          </span>
        )}

        <Button
          variant="filled"
          iconName="arrow_forward"
          iconPosition="right"
          iconFill={1}
          onClick={handleContinue}
          className="assessment-button body"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment01;
