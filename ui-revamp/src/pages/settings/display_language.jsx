import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleContext } from "../../context/ScaleContext.jsx";
import { useTranslation } from "react-i18next";

const DisplayLanguage = () => {
  const navigate = useNavigate();
  const { scale, setScale } = useContext(ScaleContext);
  const { i18n } = useTranslation();

  const [languageOpen, setLanguageOpen] = useState(false);
  // Initialize selectedLanguage based on current i18n language
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language === 'zh' ? "繁體中文" : "English"
  );
  const [fontSizeOpen, setFontSizeOpen] = useState(false);

  // Map display names to i18n language codes
  const languageMap = {
    "English": "en",
    "繁體中文": "zh"
  };

  const handleLanguageChange = (displayLanguage) => {
    setSelectedLanguage(displayLanguage);
    const languageCode = languageMap[displayLanguage];
    i18n.changeLanguage(languageCode);
  };

  // Map scale context values to display names
  const scaleToFontSize = {
    small: "Small",
    default: "Medium",
    large: "Large",
  };

  const fontSizeToScale = {
    Small: "small",
    Medium: "default",
    Large: "large",
  };

  const handleFontSizeChange = (fontSize) => {
    setScale(fontSizeToScale[fontSize]);
  };

  return (
    <div className="display-language-container">
      <div className="display-language-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="h4">Display and Language</div>
        <span className="material-symbols-rounded search"></span>
      </div>

      {/* Accordion Content */}
      <div className="display-language-content">
        {/* Language */}
        <div
          className="display-language-accordion-header"
          onClick={() => setLanguageOpen(!languageOpen)}
        >
          <div className="display-language-accordion-left">
            <span className="material-symbols-rounded accordion-icon">
              translate
            </span>
            <span className="display-language-accordion-title body">
              Language / 語言
            </span>
          </div>
          <span className="material-symbols-rounded accordion-action-icon">
            {languageOpen ? "expand_less" : "expand_more"}
          </span>
        </div>

        {languageOpen && (
          <div className="display-language-accordion-body">
            <div
              className={`display-language-accordion-option ${
                selectedLanguage === "English" ? "selected" : ""
              }`}
              onClick={() => handleLanguageChange("English")}
            >
              <span className="display-language-option-text caption">
                English
              </span>
              {selectedLanguage === "English" && (
                <span className="material-symbols-rounded option-icon-check">
                  done
                </span>
              )}
            </div>
            <div
              className={`display-language-accordion-option ${
                selectedLanguage === "繁體中文" ? "selected" : ""
              }`}
              onClick={() => handleLanguageChange("繁體中文")}
            >
              <span className="display-language-option-text caption">
                繁體中文
              </span>
              {selectedLanguage === "繁體中文" && (
                <span className="material-symbols-rounded option-icon-check">
                  done
                </span>
              )}
            </div>
          </div>
        )}

        {/* Font Size */}
        <div
          className="display-language-accordion-header"
          onClick={() => setFontSizeOpen(!fontSizeOpen)}
        >
          <div className="display-language-accordion-left">
            <span className="material-symbols-rounded accordion-icon">
              format_size
            </span>
            <span className="display-language-accordion-title body">
              Font Size
            </span>
          </div>
          <span className="material-symbols-rounded accordion-action-icon">
            {fontSizeOpen ? "expand_less" : "expand_more"}
          </span>
        </div>

        {fontSizeOpen && (
          <div className="display-language-accordion-body">
            <div
              className={`display-language-accordion-option ${
                scale === "small" ? "selected" : ""
              }`}
              onClick={() => handleFontSizeChange("Small")}
            >
              <span className="display-language-option-text caption">
                Small
              </span>
              {scale === "small" && (
                <span className="material-symbols-rounded check">done</span>
              )}
            </div>
            <div
              className={`display-language-accordion-option ${
                scale === "default" ? "selected" : ""
              }`}
              onClick={() => handleFontSizeChange("Medium")}
            >
              <span className="display-language-option-text caption">
                Medium
              </span>
              {scale === "default" && (
                <span className="material-symbols-rounded check">done</span>
              )}
            </div>
            <div
              className={`display-language-accordion-option ${
                scale === "large" ? "selected" : ""
              }`}
              onClick={() => handleFontSizeChange("Large")}
            >
              <span className="display-language-option-text caption">
                Large
              </span>
              {scale === "large" && (
                <span className="material-symbols-rounded check">done</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayLanguage;
