import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import DatePicker from "../../../components/picker/datePicker.jsx";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment02 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dob, setDob] = useState({
    month: "",
    day: "",
    year: "",
  });

  const [errorMsg, setErrorMsg] = useState(""); // for inline error

  const handleContinue = () => {
    const { month, day, year } = dob;
    if (!month || !day || !year) {
      setErrorMsg("Please select your date of birth.");
      return;
    }

    setErrorMsg(""); // clear error
    console.log("Selected DOB:", dob);
    navigate("/assessment03");
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
          <ProgressBar currentStep={2} totalSteps={9} />
        </div>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment02_title")}</h1>

        <DatePicker value={dob} onChange={setDob} />

        {errorMsg && <p className="error-message caption">{errorMsg}</p>}

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

export default Assessment02;
