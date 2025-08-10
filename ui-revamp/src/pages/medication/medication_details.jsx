import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MedicationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const medication = location.state?.medication;

  const defaultMedication = {
    med_name: "Tamoxifen",
    med_type: "Tablets",
    dosage_strength: "20 mg",
    total_quantity: "50 pcs",
    remaining_quantity: "28 pcs",
    expiry_date: "24 July, 2025",
    refill_date: "16 Dec, 2024",
    dosage_instructions: "Take 1 tablet daily, after breakfast",
    purpose: "Hormone receptor-positive breast cancer",
    side_effects: {
      common: ["Hot flashes", "Nausea", "Vaginal discharge"],
      less_common: ["Mood changes", "Headaches", "Dizziness"],
      serious: [
        "Blood clots",
        "Stroke",
        "Increased risk of endometrial cancer",
      ],
    },
  };

  const medData = medication || defaultMedication;

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
        <div className="med-details-body">
          <img src={medData.img_path || img} className="med-details-image" />
          <div className="med-details-info">
            <h2 className="med-info-title h2">{medData.med_name}</h2>
            <p className="med-info-meta body">
              {medData.med_type} • {medData.dosage_strength} •{" "}
              {medData.total_quantity}
            </p>
            <div className="med-info-remaining caption">
              <span>Remaining: {medData.remaining_quantity}</span>
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
          <h3 className="med-details-section-title h4">Main Info</h3>
          <div className="main-info-card">
            <div className="main-info-row">
              <span className="body">Expiring date</span>
              <span className="caption">{medData.expiry_date}</span>
            </div>
            {medData.refill_date && medData.refill_date !== "N/A" && (
              <div className="main-info-row">
                <span className="body">Refill date</span>
                <span className="caption">{medData.refill_date}</span>
              </div>
            )}
          </div>
        </section>

        <section className="details">
          <h3 className="med-details-section-title h4">Details</h3>
          <div className="dosage-card">
            <p className="dosage-label body">Dosage</p>
            <p className="dosage-label-value body">
              {medData.dosage_instructions}
            </p>
          </div>
          <div className="used-for-card">
            <p className="used-for-label body">Used For</p>
            <p className="used-for-label-value body">{medData.purpose}</p>
          </div>
        </section>

        <section className="side-effects">
          <h3 className="med-details-section-title h4">Side Effects</h3>

          {medData.side_effects.common && (
            <div className="side-effect-group body">
              <p className="side-effect-label common">Common:</p>
              <ul>
                {medData.side_effects.common.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}

          {medData.side_effects.less_common && (
            <div className="side-effect-group body">
              <p className="side-effect-label less-common">Less Common:</p>
              <ul>
                {medData.side_effects.less_common.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}

          {medData.side_effects.serious && (
            <div className="side-effect-group body">
              <p className="side-effect-label serious">Serious:</p>
              <ul>
                {medData.side_effects.serious.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
