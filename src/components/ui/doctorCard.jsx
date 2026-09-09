import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/doctorCard.css";

const initials = (name = "") =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";

/**
 * The patient's assigned clinician. `doctor` is the `doctor_info` block from /userinfo
 * ({ username, full_name, specialty, hospital, email, phone }); falls back to the username.
 */
export default function DoctorCard({ doctor, fallbackName }) {
  const { t } = useTranslation();
  const name = doctor?.full_name || fallbackName || t("no_doctor_assigned");
  const hasContact = Boolean(doctor?.phone || doctor?.email);

  return (
    <div className="doctor-card">
      <div className="top-section">
        <div className="doctor-image doctor-image--initials" aria-hidden="true">
          {initials(name)}
        </div>
        <div className="doctor-info">
          <h2 className="doctor-info-name body">{name}</h2>
          <p className="doctor-info-specialty caption">{doctor?.specialty || t("oncologist")}</p>
          {doctor?.hospital && (
            <p className="doctor-info-center overline-timestamp">{doctor.hospital}</p>
          )}
        </div>
      </div>

      {hasContact ? (
        <div className="bottom-section">
          {doctor?.phone && (
            <div className="info-line">
              <span className="material-symbols-rounded icon">call</span>
              <span className="doctor-card-number caption">{doctor.phone}</span>
            </div>
          )}
          {doctor?.email && (
            <div className="info-line">
              <span className="material-symbols-rounded icon">mail</span>
              <span className="doctor-card-email caption">{doctor.email}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bottom-section">
          <div className="info-line">
            <span className="material-symbols-rounded icon">info</span>
            <span className="caption">{t("doctor_contact_via_clinic")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
