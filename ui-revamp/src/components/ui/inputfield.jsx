import React, { useState } from "react";
import "../../styles/components/inputfield.css";

const InputField = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
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
        value={value}
        onChange={onChange}
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
