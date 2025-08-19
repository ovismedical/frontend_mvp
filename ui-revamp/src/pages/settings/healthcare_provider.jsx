import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../../components/ui/doctorCard.jsx";
import CareMemberCard from "../../components/ui/careMemberCard.jsx";

const HealthCareProvider = () => {
  const navigate = useNavigate();

  const careMembers = [
    {
      id: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl81ba68bvG1YwxF2v4tjIHTGLJug7cN-wLg&s",
      title: "Nurse Navigator",
      name: "Maria Rodriguez, RN",
      phoneNumber: "+85212345678",
    },
    {
      id: 2,
      image:
        "https://media.istockphoto.com/id/1299732999/photo/senior-male-nurse-portrait-looking-at-the-camera.jpg?s=612x612&w=0&k=20&c=wowfcuFB2zG5jZaeUmnUffnBnvDw1JwhzTk8mqBaKIE=",
      title: "Radiologistr",
      name: "Dr. Michael Park",
      phoneNumber: "+85287654321",
    },
    {
      id: 3,
      image:
        "https://media.istockphoto.com/id/1339984720/photo/headshot-of-a-nurse-looking-at-the-camera-with-a-stethoscope.jpg?s=612x612&w=0&k=20&c=XmP8vtnSd4aFKznky5zjcRkCzKL9eRL1Oj4h5CBd1o0=",
      title: "Nutritionist",
      name: "Lisa Thompson, RD",
      phoneNumber: "+85213579246",
    },
    {
      id: 4,
      image:
        "https://media.istockphoto.com/id/1744540827/photo/portrait-of-pleased-nurse.jpg?s=612x612&w=0&k=20&c=5_76GsX3JtPWGVnhY1G1W0p_4rWkuUpjsznmOUhJ3YI=",
      title: "Palliative Care Specialist",
      name: "Dr. Jennifer Walsh",
      phoneNumber: "+85297531468",
    },
  ];

  return (
    <div className="healthcare-provider-container">
      <div className="healthcare-provider-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
        <div className="healthcare-provider-header h4">Healthcare Provider</div>
        <span className="material-symbols-rounded search"></span>
      </div>

      <div className="healthcare-provider-content">
        <div className="healthcare-provider-doctor">
          <h2 className="healthcare-provider-title h4">Primary Oncologist</h2>
          <DoctorCard />
        </div>

        <div className="healthcare-provider-team-members">
          <h2 className="healthcare-provider-title h4">Care Team Members</h2>
          <p className="healthcare-provider-description caption">
            Stay connected with everyone involved in your care.
          </p>
          <div className="healthcare-provider-team-members-list">
            {careMembers.map((member) => (
              <CareMemberCard
                key={member.id}
                image={member.image}
                title={member.title}
                name={member.name}
                phoneNumber={member.phoneNumber}
              />
            ))}
          </div>
        </div>

        <div className="healthcare-provider-emergency-contact">
          <h2 className="healthcare-provider-title h4">Emergency Contact</h2>
          <p className="healthcare-provider-description caption">
            For immediate assistance with urgent symptoms or side effects,
            contact:
          </p>
          <div className="emergency-contact-card">
            <div className="emergency-contact-header">
              <span className="material-symbols-rounded e911_emergency">
                e911_emergency
              </span>
              <p className="emergency-contact-header-text caption">
                24/7 Emergency Line
              </p>
            </div>

            <div className="emergency-contact-number">
              <span className="material-symbols-rounded call">call</span>
              <p className="emergency-contact-number-text body">
                (+852) 1234-5678
              </p>
            </div>

            <p className="emergency-contact-footer caption">
              Available anytime for urgent support. Please call if you need
              immediate assistance!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCareProvider;
