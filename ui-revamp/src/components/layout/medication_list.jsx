import React from "react";
import MedicationCard from "../../components/ui/medicationCard";
import medicationsData from "../../data/medications.json";
import { useTranslation } from "react-i18next";
import "../../styles/components/medication_list.css";

const MedicationList = ({ activeTab, searchTerm = "" }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "zh" ? "zh" : "en";

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj[currentLang] || textObj.en;
  };

  const filteredMedications = medicationsData.medications.filter((med) => {
    let statusMatch = false;
    if (activeTab === t("active")) {
      statusMatch = med.active === true;
    } else if (activeTab === t("archived")) {
      statusMatch = med.active === false;
    }

    const medName = getLocalizedText(med.med_name);
    const searchMatch = medName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  const calculateProgress = (total, remaining) => {
    const totalNum = parseInt(total.replace(/\D/g, ""));
    const remainingNum = parseInt(remaining.replace(/\D/g, ""));
    return Math.round(((totalNum - remainingNum) / totalNum) * 100);
  };

  const getStatus = (expiryDate, isActive) => {
    if (!isActive) {
      return "archived";
    }

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "expired";
    } else if (diffDays <= 30) {
      return "nearExpiry";
    }
    return undefined;
  };

  return (
    <div className="med-list">
      {filteredMedications.length === 0 && searchTerm ? (
        <div className="body med-list-no-results">
          {t("no_medications_found", { searchTerm })}
        </div>
      ) : (
        filteredMedications.map((medication, index) => (
          <MedicationCard
            key={index}
            image={medication.img_path}
            name={getLocalizedText(medication.med_name)}
            description={`${getLocalizedText(medication.med_type)} · ${
              medication.dosage_strength
            }`}
            progress={calculateProgress(
              medication.total_quantity,
              medication.remaining_quantity
            )}
            status={getStatus(medication.expiry_date, medication.active)}
            medicationData={{
              ...medication,
              // Pass localized data to the card
              localizedName: getLocalizedText(medication.med_name),
              localizedType: getLocalizedText(medication.med_type),
              localizedPurpose: getLocalizedText(medication.purpose),
              localizedInstructions: getLocalizedText(
                medication.dosage_instructions
              ),
            }}
          />
        ))
      )}
    </div>
  );
};

export default MedicationList;
