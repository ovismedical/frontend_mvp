import React from "react";
import Button from "../../components/ui/button.jsx";
import passLinkImg from "../../assets/images/password_link.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PasswordLink = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="passwordLink-container" data-scale="large">
      <div className="backIcon-container">
        <span
          className="material-symbols-rounded chevronB_icon"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
      </div>

      <img
        src={passLinkImg}
        alt="Password Sent Illustration"
        className="passwordLink-image"
      />

      <h1 className="passwordLink-title display">{t("passwordLink_title")}</h1>

      <p className="passwordLink-subtitle body">{t("passwordLink_subtitle")}</p>

      <Button
        variant="filled"
        iconName="mail"
        iconPosition="right"
        iconFill={1}
        className="passwordLink-button body"
        onClick={() => {
          window.location.href = "mailto:";
        }}
      >
        {t("passwordLink_button")}
      </Button>

      <div className="passwordLink-footer caption">
        <p>{t("passwordLink_footer")}</p>
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

export default PasswordLink;
