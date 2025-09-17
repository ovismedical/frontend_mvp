import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/appointmentCard.css";

function AppointmentCard({ appointment, onAppointmentUpdate }) {
  const { doctor, specialty, date, time, status, avatar, phone } = appointment;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (action) => {
    setIsMenuOpen(false);

    if (action === "reschedule") {
      // Navigate to scheduler with appointment data
      navigate("/appointment_scheduler", {
        state: {
          rescheduleAppointment: appointment,
        },
      });
    } else if (action === "cancel") {
      // Update appointment status to cancelled
      const updatedAppointment = {
        ...appointment,
        status: "cancelled",
      };
      onAppointmentUpdate(updatedAppointment);
    } else if (action === "call") {
      // Handle call functionality
      if (phone) {
        // Create tel: link to initiate call
        window.location.href = `tel:${phone}`;
      } else {
        alert("Phone number not available for this doctor.");
      }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="appointment-card-container">
      {/* Header */}
      <div className="appointment-card-header">
        <img src={avatar} alt={doctor} className="appointment-card-avatar" />
        <div className="appointment-card-doctor-info">
          <h3 className="h4">{doctor}</h3>
          <p className="body">{specialty}</p>
        </div>
        <div className="appointment-card-menu-container" ref={menuRef}>
          <div className="appointment-card-menu-icon" onClick={toggleMenu}>
            <span className="material-symbols-rounded">more_vert</span>
          </div>
          {isMenuOpen && (
            <div className="appointment-card-menu-dropdown">
              <button
                className="appointment-card-menu-item"
                onClick={() => handleMenuAction("call")}
                disabled={!phone}
              >
                Call
              </button>
              {status === "upcoming" && (
                <>
                  <button
                    className="appointment-card-menu-item"
                    onClick={() => handleMenuAction("reschedule")}
                  >
                    Reschedule
                  </button>
                  <button
                    className="appointment-card-menu-item cancel"
                    onClick={() => handleMenuAction("cancel")}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Date & Time */}
      <div className="appointment-card-footer">
        <div className="appointment-card-footer-item">
          <span className="material-symbols-rounded appointment-card-footer-icon">
            calendar_month
          </span>
          <span className="appointment-card-footer-text body">{date}</span>
        </div>
        <div className="appointment-card-footer-item">
          <span className="material-symbols-rounded appointment-card-footer-icon">
            schedule
          </span>
          <span className="appointment-card-footer-text body">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
