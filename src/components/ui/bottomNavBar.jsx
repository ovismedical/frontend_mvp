import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/components/bottomNavBar.css";

const BottomNavBar = ({ isPatient = true }) => {
  const { t } = useTranslation();

  const patientNavItems = [
    { to: "/home", icon: "home", labelKey: "nav_home" },
    { to: "/dashboard", icon: "area_chart", labelKey: "nav_dashboard" },
    { to: "/chatbot", icon: "forum", labelKey: "nav_florence" },
    { to: "/appointments", icon: "calendar_today", labelKey: "nav_appointments" },
    { to: "/achievements", icon: "award_star", labelKey: "nav_achievements" },
    { to: "/settings", icon: "settings", labelKey: "nav_settings" },
  ];

  const otherNavItems = [
    { to: "/doctor_home", icon: "dashboard", labelKey: "nav_doctor_home" },
    { to: "/doctor_patients", icon: "group", labelKey: "nav_doctor_patients" },
    {
      to: "/doctor_notifications",
      icon: "notifications_active",
      labelKey: "nav_doctor_notifications",
    },
    { to: "/doctor_settings", icon: "settings", labelKey: "nav_settings" },
  ];

  const navItems = isPatient ? patientNavItems : otherNavItems;

  return (
    <nav className="bottom-nav" aria-label={t("nav_primary_label")}>
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className="nav-item">
          <span className="material-symbols-rounded" aria-hidden="true">
            {item.icon}
          </span>
          <span className="nav-item-label">{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavBar;
