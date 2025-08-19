import React, { useState, useRef, useEffect } from "react";
import "../../styles/components/dropdown.css";

const Dropdown = ({
  options,
  value,
  onChange,
  className = "",
  isOpen,
  onToggle,
}) => {
  // Use internal state only if not controlled externally
  const [internalShowDropdown, setInternalShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const showDropdown = isOpen !== undefined ? isOpen : internalShowDropdown;

  const toggleDropdown = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalShowDropdown((prev) => !prev);
    }
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    if (onToggle) {
      onToggle(); // Close dropdown
    } else {
      setInternalShowDropdown(false);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (onToggle && isOpen) {
          onToggle(); // Close controlled dropdown
        } else if (!onToggle && internalShowDropdown) {
          setInternalShowDropdown(false); // Close uncontrolled dropdown
        }
      }
    };

    // Only add listener if dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, onToggle, isOpen, internalShowDropdown]);

  return (
    <div className={`custom-dropdown-wrapper ${className}`} ref={dropdownRef}>
      <div
        className={`custom-dropdown ${
          value.toLowerCase() === "off" ? "off-state" : "on-state"
        }`}
        onClick={toggleDropdown}
      >
        <span className="dropdown-text caption">{value}</span>
        <span className="material-symbols-rounded expand-icon">
          expand_more
        </span>
      </div>
      {showDropdown && (
        <div className="custom-dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`custom-dropdown-item caption ${
                value === option ? "active" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
