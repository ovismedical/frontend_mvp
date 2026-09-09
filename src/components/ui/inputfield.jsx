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
  label,
  rightIconLabel,
  autoComplete,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const inputType = isPassword ? (visible ? "text" : "password") : type;
  // The field has no visible <label>, so without this a screen reader announces
  // nothing but the placeholder — which disappears the moment the user types.
  const accessibleName = label || placeholder || undefined;

  const toggleLabel =
    rightIconLabel || (isPassword ? (visible ? "Hide password" : "Show password") : undefined);

  return (
    <div className="input-field">
      <div className="icon-left" aria-hidden="true">
        {leftIcon}
      </div>
      <input
        type={inputType}
        placeholder={placeholder}
        className="input-element caption"
        value={value}
        onChange={onChange}
        aria-label={accessibleName}
        autoComplete={autoComplete}
        {...props}
      />
      {rightIcon && (
        <button
          type="button"
          className="icon-right"
          aria-label={toggleLabel}
          aria-pressed={isPassword ? visible : undefined}
          onClick={() => {
            setVisible(!visible);
            onRightIconClick?.();
          }}
        >
          <span aria-hidden="true">{rightIcon}</span>
        </button>
      )}
    </div>
  );
};

export default InputField;
