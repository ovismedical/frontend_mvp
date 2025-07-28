import React from "react";
import "../../styles/components/selectionOption.css";

const SelectionOption = ({ icon, label, selected, onClick }) => {
  return (
    <div
      className={`selection-option ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="selection-left">
        {icon && <span className="selection-icon">{icon}</span>}
        <span className="selection-label body ">{label}</span>
      </div>
      <div className="selection-radio">
        <span className="material-symbols-rounded selection-icon">
          {selected ? "check_circle" : "radio_button_unchecked"}
        </span>
      </div>
    </div>
  );
};

export default SelectionOption;
