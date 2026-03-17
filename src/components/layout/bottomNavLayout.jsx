import BottomNavBar from "../ui/bottomNavBar.jsx";
import { Outlet } from "react-router-dom";

export default function BottomNavLayout({ isPatient = true }) {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <Outlet />
      <BottomNavBar isPatient={isPatient} />
    </div>
  );
}
