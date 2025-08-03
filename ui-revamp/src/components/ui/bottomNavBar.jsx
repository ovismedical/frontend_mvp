import { NavLink } from "react-router-dom";
import "../../styles/components/bottomNavBar.css";

const BottomNavBar = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className="nav-item">
        <span className="material-symbols-rounded">home</span>
      </NavLink>
      <NavLink to="/dashboard" className="nav-item">
        <span className="material-symbols-rounded">area_chart</span>
      </NavLink>
      <NavLink to="/chatbot" className="nav-item">
        <span className="material-symbols-rounded">smart_toy</span>
      </NavLink>
      <NavLink to="/achievements" className="nav-item">
        <span className="material-symbols-rounded">award_star</span>
      </NavLink>
      <NavLink to="/settings" className="nav-item">
        <span className="material-symbols-rounded">settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavBar;
