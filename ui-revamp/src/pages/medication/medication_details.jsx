import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MedicationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "zh" ? "zh" : "en";

  const medication = location.state?.medication;

  const defaultMedication = {
    med_name: {
      en: "Tamoxifen",
      zh: "他莫昔芬",
    },
    med_type: {
      en: "Tablets",
      zh: "片劑",
    },
    dosage_strength: "20 mg",
    total_quantity: "50 pcs",
    remaining_quantity: "28 pcs",
    expiry_date: "24 July, 2025",
    refill_date: "16 Dec, 2024",
    dosage_instructions: {
      en: "Take 1 tablet daily, after breakfast",
      zh: "每日1片，早餐後服用",
    },
    purpose: {
      en: "Hormone receptor-positive breast cancer",
      zh: "激素受體陽性乳腺癌",
    },
    side_effects: {
      common: {
        en: ["Hot flashes", "Nausea", "Vaginal discharge"],
        zh: ["潮熱", "噁心", "陰道分泌物"],
      },
      less_common: {
        en: ["Mood changes", "Headaches", "Dizziness"],
        zh: ["情緒變化", "頭痛", "頭暈"],
      },
      serious: {
        en: ["Blood clots", "Stroke", "Increased risk of endometrial cancer"],
        zh: ["血栓", "中風", "增加子宮內膜癌風險"],
      },
    },
  };

  const medData = medication || defaultMedication;

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj[currentLang] || textObj.en;
  };

  // Helper function to get localized side effects
  const getLocalizedSideEffects = (sideEffectsObj, category) => {
    if (!sideEffectsObj || !sideEffectsObj[category]) return [];
    return getLocalizedText(sideEffectsObj[category]);
  };

  const calculateProgress = () => {
    const totalNum = parseInt(medData.total_quantity.replace(/\D/g, ""));
    const remainingNum = parseInt(
      medData.remaining_quantity.replace(/\D/g, "")
    );
    return Math.round((remainingNum / totalNum) * 100);
  };

  return (
    <div className="med-details-container">
      <div className="med-details-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
      </div>

      <div className="med-details-content">
        <div className="content-wrapper">
          <div className="med-details-body">
            <img src={medData.img_path} className="med-details-image" />
            <div className="med-details-info">
              <h2 className="med-info-title h2">
                {getLocalizedText(medData.med_name)}
              </h2>
              <p className="med-info-meta body">
                {getLocalizedText(medData.med_type)} • {medData.dosage_strength}{" "}
                • {medData.total_quantity}
              </p>
              <div className="med-info-remaining caption">
                <span>
                  {t("remaining")}: {medData.remaining_quantity}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <section className="main-info">
            <h3 className="med-details-section-title h4">{t("main_info")}</h3>
            <div className="main-info-card">
              <div className="main-info-row">
                <span className="body">{t("expiring_date")}</span>
                <span className="caption">{medData.expiry_date}</span>
              </div>
              {medData.refill_date && medData.refill_date !== "N/A" && (
                <div className="main-info-row">
                  <span className="body">{t("refill_date")}</span>
                  <span className="caption">{medData.refill_date}</span>
                </div>
              )}
            </div>
          </section>

          <section className="details">
            <h3 className="med-details-section-title h4">{t("details")}</h3>
            <div className="dosage-card">
              <p className="dosage-label body">{t("dosage")}</p>
              <p className="dosage-label-value body">
                {getLocalizedText(medData.dosage_instructions)}
              </p>
            </div>
            <div className="used-for-card">
              <p className="used-for-label body">{t("used_for")}</p>
              <p className="used-for-label-value body">
                {getLocalizedText(medData.purpose)}
              </p>
            </div>
          </section>

          <section className="side-effects">
            <h3 className="med-details-section-title h4">
              {t("side_effects")}
            </h3>

            {medData.side_effects?.common && (
              <div className="side-effect-group body">
                <p className="side-effect-label common">{t("common")}</p>
                <ul>
                  {getLocalizedSideEffects(medData.side_effects, "common").map(
                    (effect, index) => (
                      <li key={index}>{effect}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {medData.side_effects?.less_common && (
              <div className="side-effect-group body">
                <p className="side-effect-label less-common">
                  {t("less_common")}
                </p>
                <ul>
                  {getLocalizedSideEffects(
                    medData.side_effects,
                    "less_common"
                  ).map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {medData.side_effects?.serious && (
              <div className="side-effect-group body">
                <p className="side-effect-label serious">{t("serious")}</p>
                <ul>
                  {getLocalizedSideEffects(medData.side_effects, "serious").map(
                    (effect, index) => (
                      <li key={index}>{effect}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
