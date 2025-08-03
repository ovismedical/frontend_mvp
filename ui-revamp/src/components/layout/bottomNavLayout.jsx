import BottomNavBar from "../ui/bottomNavBar.jsx";
import { Outlet } from "react-router-dom";

export default function BottomNavLayout() {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <Outlet />
      <BottomNavBar />
    </div>
  );
}
