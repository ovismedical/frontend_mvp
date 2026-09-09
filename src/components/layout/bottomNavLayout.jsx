import BottomNavBar from "../ui/bottomNavBar.jsx";
import { Outlet } from "react-router-dom";
import "../../styles/components/bottomNavBar.css";

export default function BottomNavLayout({ isPatient = true }) {
  return (
    <div className="bottom-nav-layout">
      <Outlet />
      <BottomNavBar isPatient={isPatient} />
    </div>
  );
}
