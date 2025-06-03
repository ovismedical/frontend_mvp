import { useState } from "react"
import { Link } from "react-router-dom";
import "./sideheader.css"

function SideHeader() {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <div>
      <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-button"
      >
          ☰
      </button>
      {/* Sidebar Menu */}
      {isOpen && (
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <button className="close-button" onClick={() => setIsOpen(false)}>✖</button>

          <Link to="/dashboard" >Main Page</Link>
          <Link to="/personalinfo">Personal Info</Link>
          <Link to="/dailylogger">Daily Logger</Link>
          <Link to="/data">Data</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/faq">FAQ</Link>
        </ul>
        <div className="sidebar-footer">
          <Link to="/contactus">Contact Us</Link>
        </div>
      </div>
      )}
    </div>
  
  );
}

export default SideHeader;