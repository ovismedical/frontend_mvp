import React from "react";
import "../../styles/typography.css";
import "../../styles/components/button.css";
import "material-symbols";

const Button = ({
  children,
  variant = "filled", // 'filled' | 'outlined'
  iconName = null,
  iconPosition = "left", // 'left' | 'right'
  iconFill = 0, // 0 = outline, 1 = filled
  className = "",
  ...props
}) => {
  const renderIcon = () => {
    if (!iconName) return null;

    return (
      <span
        className="material-symbols-rounded"
        style={{
          fontVariationSettings: `'FILL' ${iconFill}, 'wght' 500, 'GRAD' 0, 'opsz' 20`,
        }}
      >
        {iconName}
      </span>
    );
  };

  return (
    <button className={`custom-button ${variant} ${className}`} {...props}>
      <span className="button-content">
        {iconName && iconPosition === "left" && (
          <span className="button-icon left">{renderIcon()}</span>
        )}
        <span className="button-text body">{children}</span>
        {iconName && iconPosition === "right" && (
          <span className="button-icon right">{renderIcon()}</span>
        )}
      </span>
    </button>
  );
};

export default Button;
