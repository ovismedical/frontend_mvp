import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoctorHeader from "../../components/layout/doctorHeader";
import OverviewCard from "../../components/ui/overviewCard";
import RecentActivityCard from "../../components/ui/recentActivityCard";
import GenerateReportModal from "../../components/ui/generateReportModal";
import patients from "../../data/patients.json";

const MESSAGE_TYPES = [
  { value: "vitals", label: "Vitals Alert" },
  { value: "symptom", label: "Symptom Alert" },
  { value: "meds", label: "Medication Changed" },
  { value: "appointment", label: "Appointment Reminder" },
  { value: "general", label: "General Message" },
];

const DoctorHome = () => {
  const { t } = useTranslation();

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAction, setPatientAction] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({
    title: "",
    description: "",
    type: "",
  });
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const navigate = useNavigate();

  const handleAddPrescriptionClick = () => {
    setPatientAction("prescription");
    setShowPatientModal(true);
  };

  const handleGenerateReportClick = () => {
    setPatientAction("report");
    setShowPatientModal(true);
  };

  const handleSendMessageClick = () => {
    setPatientAction("message");
    setShowPatientModal(true);
  };

  const handlePatientSelect = (patient) => {
    setShowPatientModal(false);
    if (patientAction === "report") {
      setSelectedPatient(patient);
      setTimeout(() => setShowReportModal(true), 200);
    } else if (patientAction === "prescription") {
      navigate(`/add_medication/${patient.id}`);
    } else if (patientAction === "message") {
      setSelectedPatient(patient);
      setTimeout(() => setShowMessageModal(true), 200);
    }
    setPatientAction(null);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedPatient(null);
  };

  const handleAddPatientClick = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      const video = document.getElementById("camera-video");
      if (video) {
        video.srcObject = stream;
      }
    } catch (err) {
      alert("Could not access camera: " + err.message);
      setShowCameraModal(false);
    }
  };

  const handleCloseCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setShowCameraModal(false);
    setCameraStream(null);
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedPatient(null);
    setMessageForm({
      title: "",
      description: "",
      type: "", // <-- Start with empty string for placeholder
    });
  };

  const handleMessageFormChange = (e) => {
    const { name, value } = e.target;
    setMessageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // TODO: send message to backend
    handleCloseMessageModal();
  };

  return (
    <div className="doctor-home-container">
      <DoctorHeader />

      <div className="doctor-home-content">
        <div className="doctor-home-overview">
          <h3 className="doctor-home-section-title h4">
            {t("todays_overview")}
          </h3>
          <div className="doctor-home-overview-cards">
            <OverviewCard
              icon="groups"
              changeIcon="arrow_upward_alt"
              changeValue="12%"
              cardValue="128"
              cardTitle={t("total_patients")}
              changeClass="positive"
            />
            <OverviewCard
              icon="warning"
              changeIcon="arrow_downward_alt"
              changeValue="4%"
              cardValue="12"
              cardTitle={t("critical_alerts")}
              changeClass="positive"
              variant="blue"
            />
            <OverviewCard
              icon="pending_actions"
              changeIcon="arrow_upward_alt"
              changeValue="20%"
              cardValue="20"
              cardTitle={t("pending_reports")}
              changeClass="negative"
              variant="blue"
            />
            <OverviewCard
              icon="group_add"
              changeIcon="arrow_upward_alt"
              changeValue="12%"
              cardValue="06"
              cardTitle={t("pending_requests")}
              changeClass="positive"
            />
          </div>
        </div>

        <div className="doctor-home-recent-activity">
          <h3 className="doctor-home-section-title h4">
            {t("recent_activity")}
          </h3>
          <div className="doctor-home-recent-activity-cards">
            <RecentActivityCard
              type="report"
              title={t("new_patient_report")}
              patient="John Doe"
              time="20 minutes ago"
            />
            <RecentActivityCard
              type="alert"
              title={t("critical_alert")}
              patient="Jane Smith"
              time="45 minutes ago"
            />
            <RecentActivityCard
              type="prescription"
              title={t("prescription_update")}
              patient="Emily Johnson"
              time="1 hour ago"
            />
            <RecentActivityCard
              type="request"
              title={t("request_accepted")}
              patient="Harley West"
              time="3 hour ago"
            />
          </div>
        </div>

        <div className="doctor-home-quick-actions">
          <h3 className="doctor-home-section-title h4">{t("quick_actions")}</h3>
          <div className="doctor-home-quick-actions-cards">
            <div
              className="quick-action-card"
              onClick={handleAddPatientClick}
              style={{ cursor: "pointer" }}
            >
              <span className="material-symbols-rounded action-card-icon">
                person_add
              </span>
              <p className="quick-action-card-text caption">
                {t("add_patient")}
              </p>
            </div>
            <div
              className="quick-action-card"
              onClick={handleSendMessageClick}
              style={{ cursor: "pointer" }}
            >
              <span className="material-symbols-rounded action-card-icon">
                chat
              </span>
              <p className="quick-action-card-text caption">
                {t("send_patient_message")}
              </p>
            </div>
            <div
              className="quick-action-card"
              onClick={handleAddPrescriptionClick}
              style={{ cursor: "pointer" }}
            >
              <span className="material-symbols-rounded action-card-icon">
                mixture_med
              </span>
              <p className="quick-action-card-text caption">
                {t("add_prescription")}
              </p>
            </div>
            <div
              className="quick-action-card"
              onClick={handleGenerateReportClick}
              style={{ cursor: "pointer" }}
            >
              <span className="material-symbols-rounded action-card-icon">
                file_save
              </span>
              <p className="quick-action-card-text caption">
                {t("generate_report")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Select Patient Modal */}
      {showPatientModal && (
        <div className="choose-patient-modal-overlay">
          <div className="choose-patient-modal">
            <div className="choose-patient-modal-header">
              <h3 className="choose-patient-title h4">
                {t("select_a_patient")}
              </h3>
              <span
                className="material-symbols-rounded choose-patient-close"
                onClick={() => setShowPatientModal(false)}
              >
                close
              </span>
            </div>
            <div className="choose-patient-dropdown">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="choose-patient-option body"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="choose-patient-avatar"
                  />
                  <span>{patient.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <GenerateReportModal
          open={showReportModal}
          onClose={handleCloseReportModal}
          patient={selectedPatient}
        />
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="add-patient-modal-overlay">
          <div className="add-patient-modal">
            <div className="add-patient-modal-header">
              <h3 className="add-patient-title h4">{t("add_patient")}</h3>
              <span
                className="material-symbols-rounded add-patient-close"
                onClick={handleCloseCameraModal}
              >
                close
              </span>
            </div>
            <p className="add-patient-subtext body">{t("scan_patient_qr")}</p>
            <video id="camera-video" autoPlay />
          </div>
        </div>
      )}

      {/* Send Patient Message Modal */}
      {showMessageModal && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="message-modal-header">
              <h3 className="message-modal-title h4">
                {t("send_message_to", { name: selectedPatient?.name })}
              </h3>
              <span
                className="material-symbols-rounded message-modal-close"
                onClick={handleCloseMessageModal}
              >
                close
              </span>
            </div>
            <form
              onSubmit={handleSendMessage}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <label className="body" style={{ color: "var(--text-500)" }}>
                {t("title")}
                <input
                  name="title"
                  value={messageForm.title}
                  onChange={handleMessageFormChange}
                  className="message-input caption"
                  required
                  placeholder={t("enter_message_title")}
                />
              </label>
              <label className="body" style={{ color: "var(--text-500)" }}>
                {t("description")}
                <textarea
                  name="description"
                  value={messageForm.description}
                  onChange={handleMessageFormChange}
                  className="message-textarea caption"
                  required
                  placeholder={t("enter_message_details")}
                />
              </label>
              <label className="body" style={{ color: "var(--text-500)" }}>
                {t("message_type")}
                <div
                  className="message-dropdown"
                  tabIndex={0}
                  onBlur={() => setShowMessageDropdown(false)}
                  style={{ marginTop: 4 }}
                >
                  <div
                    className={
                      "message-dropdown-selected caption" +
                      (!messageForm.type ? " placeholder" : "")
                    }
                    onClick={() => setShowMessageDropdown((v) => !v)}
                  >
                    {MESSAGE_TYPES.find((opt) => opt.value === messageForm.type)
                      ? t(
                          MESSAGE_TYPES.find(
                            (opt) => opt.value === messageForm.type
                          ).label
                        )
                      : t("select_message_type")}
                    <span
                      className="material-symbols-rounded"
                      style={{ fontSize: 18 }}
                    >
                      expand_more
                    </span>
                  </div>
                  {showMessageDropdown && (
                    <div className="message-dropdown-list">
                      {MESSAGE_TYPES.map((opt) => (
                        <div
                          key={opt.value}
                          className={
                            "message-dropdown-item body" +
                            (messageForm.type === opt.value ? " selected" : "")
                          }
                          onClick={() => {
                            setMessageForm((prev) => ({
                              ...prev,
                              type: opt.value,
                            }));
                            setShowMessageDropdown(false);
                          }}
                        >
                          {t(opt.label)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <button type="submit" className="message-send-btn">
                {t("send_message")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorHome;
