import React from "react";
import Button from "../../components/ui/button.jsx";
import onboarding02Img from "../../assets/images/onboarding02.png";
import { useNavigate } from "react-router-dom";

const Onboarding02 = () => {
  const navigate = useNavigate();

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
        <h1 className="onboarding-title display">AI-Powered Symptom Logger</h1>
        <p className="onboarding-subtitle body">
          Quick, accurate insights for peace of mind based from our AI LLMs.
        </p>

        <img
          src={onboarding02Img}
          alt="AI-Powered Symptom Logger"
          className="onboarding-image"
        />
      </div>

      <div className="onboarding-bottom-section">
        <div className="onboarding-button-row">
          <Button variant="outline">Skip</Button>
          <Button
            variant="filled"
            iconName="arrow_forward"
            iconPosition="right"
            iconFill={1}
            onClick={() => navigate("/onboarding03")}
          >
            Next
          </Button>
        </div>

        <p className="onboarding-footer caption">
          Got a question? Visit our{" "}
          <a href="#" className="helpCenter-link caption">
            Help Center!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Onboarding02;
