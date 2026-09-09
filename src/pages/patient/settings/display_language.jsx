import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleContext } from "../../../context/ScaleContext.jsx";
import { useTranslation } from "react-i18next";
import BackButton from "../../../components/ui/backButton";
const DisplayLanguage = () => {
  // Backend Handling: Fetch and update user language and font size preferences from/to backend
  const navigate = useNavigate();
  const { scale, setScale } = useContext(ScaleContext);
  const { t, i18n } = useTranslation();

  const [languageOpen, setLanguageOpen] = useState(false);
  // Initialize selectedLanguage based on current i18n language
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language === "zh" ? "繁體中文" : "English"
  );
  const [fontSizeOpen, setFontSizeOpen] = useState(false);

  // Map display names to i18n language codes
  const languageMap = {
    English: "en",
    繁體中文: "zh",
  };

  const handleLanguageChange = (displayLanguage) => {
    setSelectedLanguage(displayLanguage);
    const languageCode = languageMap[displayLanguage];
    i18n.changeLanguage(languageCode);
  };

  // Map scale context values to display names with translations
  const scaleToFontSize = {
    small: t("small"),
    default: t("medium"),
    large: t("large"),
  };

  const fontSizeToScale = {
    [t("small")]: "small",
    [t("medium")]: "default",
    [t("large")]: "large",
  };

  const handleFontSizeChange = (fontSize) => {
    setScale(fontSizeToScale[fontSize]);
  };

  return (
    <div className="display-language-container">
      <div className="display-language-header">
        <BackButton className="chevron_backward" onClick={() => navigate(-1)} />
        <div className="h4">{t("display_and_language")}</div>
        <span className="material-symbols-rounded search" aria-hidden="true"></span>
      </div>

      {/* Accordion Content */}
      <div className="display-language-content">
        {/* Language */}
        <button type="button"
          className="display-language-accordion-header"
          onClick={() => setLanguageOpen(!languageOpen)}
          aria-expanded={languageOpen}
        >
          <div className="display-language-accordion-left">
            <span className="material-symbols-rounded accordion-icon" aria-hidden="true">
              translate
            </span>
            <span className="display-language-accordion-title body">
              {t("language")}
            </span>
          </div>
          <span className="material-symbols-rounded accordion-action-icon" aria-hidden="true">
            {languageOpen ? "expand_less" : "expand_more"}
          </span>
        </button>

        {languageOpen && (
          <div className="display-language-accordion-body">
            <button type="button"
              className={`display-language-accordion-option ${
                selectedLanguage === "English" ? "selected" : ""
              }`}
              onClick={() => handleLanguageChange("English")}
            >
              <span className="display-language-option-text caption">
                English
              </span>
              {selectedLanguage === "English" && (
                <span className="material-symbols-rounded option-icon-check" aria-hidden="true">
                  done
                </span>
              )}
            </button>
            <button type="button"
              className={`display-language-accordion-option ${
                selectedLanguage === "繁體中文" ? "selected" : ""
              }`}
              onClick={() => handleLanguageChange("繁體中文")}
            >
              <span className="display-language-option-text caption">
                繁體中文
              </span>
              {selectedLanguage === "繁體中文" && (
                <span className="material-symbols-rounded option-icon-check" aria-hidden="true">
                  done
                </span>
              )}
            </button>
          </div>
        )}

        {/* Font Size */}
        <button type="button"
          className="display-language-accordion-header"
          onClick={() => setFontSizeOpen(!fontSizeOpen)}
        >
          <div className="display-language-accordion-left">
            <span className="material-symbols-rounded accordion-icon" aria-hidden="true">
              format_size
            </span>
            <span className="display-language-accordion-title body">
              {t("font_size")}
            </span>
          </div>
          <span className="material-symbols-rounded accordion-action-icon" aria-hidden="true">
            {fontSizeOpen ? "expand_less" : "expand_more"}
          </span>
        </button>

        {fontSizeOpen && (
          <div className="display-language-accordion-body">
            <button type="button"
              className={`display-language-accordion-option ${
                scale === "small" ? "selected" : ""
              }`}
              onClick={() => handleFontSizeChange(t("small"))}
            >
              <span className="display-language-option-text caption">
                {t("small")}
              </span>
              {scale === "small" && (
                <span className="material-symbols-rounded check" aria-hidden="true">done</span>
              )}
            </button>
            <button type="button"
              className={`display-language-accordion-option ${
                scale === "default" ? "selected" : ""
              }`}
              onClick={() => handleFontSizeChange(t("medium"))}
            >
              <span className="display-language-option-text caption">
                {t("medium")}
              </span>
              {scale === "default" && (
                <span className="material-symbols-rounded check" aria-hidden="true">done</span>
              )}
            </button>
            <button type="button"
              className={`display-language-accordion-option ${
                scale === "large" ? "selected" : ""
              }`}
              onClick={() => handleFontSizeChange(t("large"))}
            >
              <span className="display-language-option-text caption">
                {t("large")}
              </span>
              {scale === "large" && (
                <span className="material-symbols-rounded check" aria-hidden="true">done</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayLanguage;
