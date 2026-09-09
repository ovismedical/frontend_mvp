import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoctorCard from "../../../components/ui/doctorCard.jsx";
import CareMemberCard from "../../../components/ui/careMemberCard.jsx";
import StatusBanner from "../../../components/ui/statusBanner";
import { useAuth } from "../../../context/AuthContext";

const HealthCareProvider = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "zh" ? "zh" : "en";
  const { user } = useAuth();

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj[currentLang] || textObj.en;
  };

  // Backend Handling: Fetch healthcare provider and care team data from backend
  const careMembers = [
    {
      id: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl81ba68bvG1YwxF2v4tjIHTGLJug7cN-wLg&s",
      title: {
        en: "Nurse Navigator",
        zh: "護理導航員",
      },
      name: "Maria Rodriguez, RN",
      phoneNumber: "+85212345678",
    },
    {
      id: 2,
      image:
        "https://media.istockphoto.com/id/1299732999/photo/senior-male-nurse-portrait-looking-at-the-camera.jpg?s=612x612&w=0&k=20&c=wowfcuFB2zG5jZaeUmnUffnBnvDw1JwhzTk8mqBaKIE=",
      title: {
        en: "Radiologist",
        zh: "放射科醫生",
      },
      name: "Dr. Michael Park",
      phoneNumber: "+85287654321",
    },
    {
      id: 3,
      image:
        "https://media.istockphoto.com/id/1339984720/photo/headshot-of-a-nurse-looking-at-the-camera-with-a-stethoscope.jpg?s=612x612&w=0&k=20&c=XmP8vtnSd4aFKznky5zjcRkCzKL9eRL1Oj4h5CBd1o0=",
      title: {
        en: "Nutritionist",
        zh: "營養師",
      },
      name: "Lisa Thompson, RD",
      phoneNumber: "+85213579246",
    },
    {
      id: 4,
      image:
        "https://media.istockphoto.com/id/1744540827/photo/portrait-of-pleased-nurse.jpg?s=612x612&w=0&k=20&c=5_76GsX3JtPWGVnhY1G1W0p_4rWkuUpjsznmOUhJ3YI=",
      title: {
        en: "Palliative Care Specialist",
        zh: "緩和治療專家",
      },
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
        <div className="healthcare-provider-header h4">
          {t("healthcare_provider")}
        </div>
        <span className="material-symbols-rounded search"></span>
      </div>

      <div className="healthcare-provider-content">
        <div className="healthcare-provider-doctor">
          <h2 className="healthcare-provider-title h4">
            {t("primary_oncologist")}
          </h2>
          <DoctorCard doctor={user?.doctor_info} fallbackName={user?.doctor_name || user?.doctor} />
        </div>

        <div className="healthcare-provider-team-members">
          <h2 className="healthcare-provider-title h4">
            {t("care_team_members")}
          </h2>
          <p className="healthcare-provider-description caption">
            {t("care_team_description")}
          </p>
          <StatusBanner variant="coming-soon" message={t("care_team_coming_soon")} />
          <div className="healthcare-provider-team-members-list">
            {careMembers.map((member) => (
              <CareMemberCard
                key={member.id}
                image={member.image}
                title={getLocalizedText(member.title)}
                name={member.name}
                phoneNumber={member.phoneNumber}
              />
            ))}
          </div>
        </div>

        <div className="healthcare-provider-emergency-contact">
          <h2 className="healthcare-provider-title h4">
            {t("emergency_contact")}
          </h2>
          <p className="healthcare-provider-description caption">
            {t("emergency_contact_description")}
          </p>
          <StatusBanner variant="coming-soon" message={t("emergency_line_coming_soon")} compact />
          <div className="emergency-contact-card">
            <div className="emergency-contact-header">
              <span className="material-symbols-rounded e911_emergency">
                e911_emergency
              </span>
              <p className="emergency-contact-header-text caption">
                {t("24_7_emergency_line")}
              </p>
            </div>

            <div className="emergency-contact-number">
              <span className="material-symbols-rounded call">call</span>
              <p className="emergency-contact-number-text body">
                (+852) 1234-5678
              </p>
            </div>

            <p className="emergency-contact-footer caption">
              {t("emergency_contact_footer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCareProvider;
