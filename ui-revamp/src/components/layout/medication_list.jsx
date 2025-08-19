import React from "react";
import MedicationCard from "../../components/ui/medicationCard";
import medicationsData from "../../data/medications.json";
import "../../styles/components/medication_list.css";

const MedicationList = ({ activeTab, searchTerm = "" }) => {
  const filteredMedications = medicationsData.medications.filter((med) => {
    let statusMatch = false;
    if (activeTab === "Active") {
      statusMatch = med.active === true;
    } else if (activeTab === "Archived") {
      statusMatch = med.active === false;
    }

    const searchMatch = med.med_name
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
          No medications found matching "{searchTerm}"
        </div>
      ) : (
        filteredMedications.map((medication, index) => (
          <MedicationCard
            key={index}
            image={medication.img_path}
            name={medication.med_name}
            description={`${medication.med_type} · ${medication.dosage_strength}`}
            progress={calculateProgress(
              medication.total_quantity,
              medication.remaining_quantity
            )}
            status={getStatus(medication.expiry_date, medication.active)}
            medicationData={medication}
          />
        ))
      )}
    </div>
  );
};

export default MedicationList;
