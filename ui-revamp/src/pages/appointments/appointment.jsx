import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/ui/tabs";
import AppointmentCard from "../../components/ui/appointmentCard";
// Backend Handling: Fetch appointments and doctors from backend
import appointmentsData from "../../data/appointments.json";
import doctorsData from "../../data/doctors.json";

const Appointment = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [appointments, setAppointments] = useState([]);

  // Backend Handling: Add new appointment (push to backend)
  const handleAddNewAppointment = (e) => {
    e.preventDefault();
    navigate("/appointment_scheduler");
  };

  // Backend Handling: Update appointment status/details (push to backend)
  const handleAppointmentUpdate = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      )
    );
  };

  useEffect(() => {
    // Merge appointments with doctor data
    const mergedAppointments = appointmentsData.map((appointment) => {
      const doctor = doctorsData.find((doc) => doc.id === appointment.doctorId);
      return {
        ...appointment,
        doctor: doctor?.name || "Unknown Doctor",
        specialty: doctor?.specialty || "Unknown Specialty",
        phone: doctor?.phone || null,
        avatar:
          doctor?.avatar ||
          `https://via.placeholder.com/80x80.png?text=${
            doctor?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "Dr"
          }`,
      };
    });
    setAppointments(mergedAppointments);
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  const tabs = [
    { name: "Upcoming" },
    { name: "Completed" },
    { name: "Cancelled" },
  ];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.status === activeTab.toLowerCase() &&
      (appt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <span
          className="material-symbols-rounded"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        >
          arrow_back
        </span>
        <div className="appointment-header h4">Appointments</div>
        <span
          className="material-symbols-rounded search"
          onClick={toggleSearch}
          style={{ cursor: "pointer" }}
        >
          search
        </span>
      </div>

      {isSearchVisible && (
        <div className="appointment-search-input-container">
          <input
            className="body"
            type="text"
            placeholder="Search for appointment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <Tabs tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />

      <div className="appointment-content">
        <div className="appointment-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onAppointmentUpdate={handleAppointmentUpdate}
              />
            ))
          ) : (
            <p className="empty-msg">
              No {activeTab.toLowerCase()} appointments found
            </p>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        className="appointment-add-fab "
        onClick={handleAddNewAppointment}
      >
        <span className="material-symbols-rounded add-fab-icon">add</span>
      </button>
    </div>
  );
};

export default Appointment;
