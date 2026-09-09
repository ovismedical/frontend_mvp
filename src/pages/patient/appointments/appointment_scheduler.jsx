import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/button";
import doctorsData from "../../../fixtures/doctors.json";
import timeSlotsData from "../../../fixtures/timeSlots.json";
import appointmentsData from "../../../fixtures/appointments.json";
import StatusBanner from "../../../components/ui/statusBanner";
import BackButton from "../../../components/ui/backButton";
const generateDates = () => {
  const days = [];
  const today = new Date();
  for (let i = 1; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const formatDateToString = (date) => {
  return date.toISOString().split("T")[0];
};

const isDateUnavailable = (doctor, date) => {
  const dateString = formatDateToString(date);
  return doctor.unavailableDates.includes(dateString);
};

const isTimeUnavailable = (doctor, date, time) => {
  const dateString = formatDateToString(date);
  return doctor.unavailableTimes[dateString]?.includes(time) || false;
};

const isTimeBooked = (doctorId, date, time, excludeAppointmentId = null) => {
  const dateString = formatDateToString(date);
  return appointmentsData.some(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.date === dateString &&
      appointment.time === time &&
      appointment.status !== "cancelled" &&
      appointment.id !== excludeAppointmentId // Exclude current appointment when rescheduling
  );
};

function AppointmentScheduler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [originalAppointment, setOriginalAppointment] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Check if this is a reschedule operation
  useEffect(() => {
    const rescheduleData = location.state?.rescheduleAppointment;
    if (rescheduleData) {
      setIsRescheduling(true);
      setOriginalAppointment(rescheduleData);

      // Find and set the doctor
      const doctor = doctorsData.find(
        (doc) => doc.id === rescheduleData.doctorId
      );
      if (doctor) {
        setSelectedDoctor(doctor);
      }

      // Set the original date
      const originalDate = new Date(rescheduleData.date + "T00:00:00");
      setSelectedDate(originalDate);

      // Set the original time
      setSelectedTime(rescheduleData.time);

      // Set the reason
      setReason(rescheduleData.reason || "");
    }
  }, [location.state]);

  // Backend Handling: Book or reschedule appointment (push to backend)
  const confirmBooking = () => {
    // Check if all required fields are filled
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setMessage({
        type: "error",
        text: "Please select doctor, date, and time before confirming.",
      });
      return;
    }

    // Check if reason is provided
    if (!reason.trim()) {
      setMessage({
        type: "error",
        text: "Please provide a reason for your visit.",
      });
      return;
    }

    // If all validation passes
    const actionText = isRescheduling ? "rescheduled" : "confirmed";
    setMessage({
      type: "success",
      text: `Appointment ${actionText} with ${
        selectedDoctor.name
      } on ${selectedDate.toDateString()} at ${selectedTime}`,
    });

    // Navigate to appointments list after a short delay
    setTimeout(() => {
      navigate("/appointments");
    }, 2000);
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const hasUnsavedChanges = () => {
    if (isRescheduling && originalAppointment) {
      const originalDate = new Date(originalAppointment.date + "T00:00:00");
      return (
        selectedDate?.toDateString() !== originalDate.toDateString() ||
        selectedTime !== originalAppointment.time ||
        reason.trim() !== (originalAppointment.reason || "").trim()
      );
    }
    return selectedDoctor || selectedDate || selectedTime || reason.trim();
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges()) {
      setShowExitModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    navigate(-1);
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  return (
    <div className="appointment-scheduler-container">
      <StatusBanner variant="coming-soon" messageKey="appointments_coming_soon" />
      {/* Header */}
      <div className="appointment-scheduler-header">
        <BackButton className="chevron_backward" onClick={handleBackClick} />
        <h2 className="appointment-scheduler-title h4">
          {isRescheduling ? "Reschedule Appointment" : "Book Appointment"}
        </h2>
        <div></div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="appointment-scheduler-modal-overlay">
          <div className="appointment-scheduler-modal-content">
            <div className="appointment-scheduler-modal-icon">
              <span className="material-symbols-rounded">warning</span>
            </div>
            <h3 className="appointment-scheduler-modal-title h4">
              {isRescheduling ? "Discard Changes?" : "Leave Without Booking?"}
            </h3>
            <p className="appointment-scheduler-modal-message body">
              {isRescheduling
                ? "Your appointment changes haven't been saved. If you leave now, your changes will be lost."
                : "Your appointment hasn't been booked yet. If you leave now, you'll need to start over."}
            </p>
            <div className="modal-actions">
              <Button
                variant="outlined"
                onClick={handleExitCancel}
                className="modal-cancel-btn"
              >
                Stay
              </Button>
              <Button
                variant="filled"
                onClick={handleExitConfirm}
                className="modal-confirm-btn"
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="material-symbols-rounded">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="appointment-scheduler-content">
        <div className="appointment-sections-wrapper">
          {/* Doctor Selection - Only show when not rescheduling */}
          {!isRescheduling && (
            <div className="appointment-section doctor-section">
              <h3 className="section-title h4">Choose doctor:</h3>
              <div className="doctor-selection">
                {doctorsData.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`doctor-card ${
                      selectedDoctor?.id === doctor.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setMessage({ type: "", text: "" });
                    }}
                  >
                    <div className="doctor-icon">
                      <span className="material-symbols-rounded">
                        {doctor.icon}
                      </span>
                    </div>
                    <div className="doctor-info">
                      <h4 className="doctor-name body-semibold">
                        {doctor.name}
                      </h4>
                      <p className="doctor-specialty caption">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show current doctor info when rescheduling */}
          {isRescheduling && selectedDoctor && (
            <div className="appointment-section doctor-section">
              <h3 className="section-title h4">Doctor:</h3>
              <div className="doctor-card selected">
                <div className="doctor-icon">
                  <span className="material-symbols-rounded">
                    {selectedDoctor.icon}
                  </span>
                </div>
                <div className="doctor-info">
                  <h4 className="doctor-name body-semibold">
                    {selectedDoctor.name}
                  </h4>
                  <p className="doctor-specialty caption">
                    {selectedDoctor.specialty}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Date, Time, and Reason Selection */}
          {selectedDoctor && (
            <div className="datetime-section">
              <div className="datetime-sections">
                {/* Date Selection */}
                <div className="appointment-section">
                  <h3 className="section-title h4">Select Date</h3>
                  <div className="date-calendar">
                    {generateDates().map((date) => {
                      const unavailable = isDateUnavailable(
                        selectedDoctor,
                        date
                      );
                      return (
                        <div
                          key={date.toDateString()}
                          className={`date-card ${
                            selectedDate?.toDateString() === date.toDateString()
                              ? "selected"
                              : ""
                          } ${unavailable ? "unavailable" : ""}`}
                          onClick={() => {
                            if (!unavailable) {
                              setSelectedDate(date);
                              if (
                                !isRescheduling ||
                                selectedDate?.toDateString() !==
                                  date.toDateString()
                              ) {
                                setSelectedTime(null);
                              }
                              setMessage({ type: "", text: "" });
                            }
                          }}
                        >
                          <span className="date-day overline-timestamp">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                          <span className="date-number body">
                            {date.getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="appointment-section">
                    <h3 className="section-title h4">Select Time</h3>
                    <div className="time-slots-grid">
                      {timeSlotsData.map((time) => {
                        const timeUnavailable = isTimeUnavailable(
                          selectedDoctor,
                          selectedDate,
                          time
                        );
                        const timeBooked = isTimeBooked(
                          selectedDoctor.id,
                          selectedDate,
                          time,
                          isRescheduling ? originalAppointment?.id : null
                        );
                        const disabled = timeUnavailable || timeBooked;

                        return (
                          <button
                            key={time}
                            className={`time-slot-btn ${
                              selectedTime === time ? "selected" : ""
                            } ${disabled ? "unavailable" : ""} body`}
                            onClick={() => {
                              if (!disabled) {
                                setSelectedTime(time);
                                setMessage({ type: "", text: "" });
                              }
                            }}
                            disabled={disabled}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reason for Visit - Now inside the datetime section */}
                {selectedTime && (
                  <div className="appointment-section">
                    <h3 className="section-title h4">Reason for Visit</h3>
                    <div className="reason-input-container">
                      <textarea
                        className="reason-textarea caption"
                        rows="4"
                        placeholder="Please describe the reason for your visit (required)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button - Keep below the flex layout */}
        {selectedTime && (
          <div className="confirm-section">
            <Button
              variant="filled"
              onClick={confirmBooking}
              className="confirm-appointment-btn body"
            >
              {isRescheduling
                ? "Reschedule Appointment"
                : "Confirm Appointment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentScheduler;
