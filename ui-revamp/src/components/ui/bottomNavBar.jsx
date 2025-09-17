import { NavLink } from "react-router-dom";
import "../../styles/components/bottomNavBar.css";

const BottomNavBar = ({ isPatient = true }) => {
  const patientNavItems = [
    { to: "/home", icon: "home" },
    { to: "/dashboard", icon: "area_chart" },
    { to: "/chatbot", icon: "smart_toy" },
    { to: "/appointments", icon: "calendar_today" },
    { to: "/achievements", icon: "award_star" },
    { to: "/settings", icon: "settings" },
  ];

  // Define your alternative nav items here
  const otherNavItems = [
    { to: "/doctor_home", icon: "dashboard" },
    { to: "/doctor_patients", icon: "group" },
    { to: "/doctor_notifications", icon: "notifications_active" },
    { to: "/doctor_settings", icon: "settings" },
  ];

  const navItems = isPatient ? patientNavItems : otherNavItems;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className="nav-item">
          <span className="material-symbols-rounded">{item.icon}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavBar;
