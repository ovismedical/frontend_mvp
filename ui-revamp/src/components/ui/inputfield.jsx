import React from "react";
import { useState } from "react";
import "../../styles/components/inputfield.css";

const InputField = ({
  type = "text",
  placeholder = "",
  leftIcon,
  rightIcon,
  onRightIconClick,
  isPassword = false,
}) => {
  const [visible, setVisible] = useState(false);

  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="input-field" data-scale="large">
      <div className="icon-left">{leftIcon}</div>
      <input
        type={inputType}
        placeholder={placeholder}
        className="input-element caption"
      />
      {rightIcon && (
        <div
          className="icon-right"
          onClick={() => {
            setVisible(!visible);
            onRightIconClick?.();
          }}
        >
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default InputField;
