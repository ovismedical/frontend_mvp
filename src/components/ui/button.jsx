import React from "react";
import "../../styles/typography.css";
import "../../styles/components/button.css";

const Button = ({
  children,
  variant = "filled", // 'filled' | 'outline'
  iconName = null,
  iconPosition = "left", // 'left' | 'right'
  iconFill = 0, // 0 = outline, 1 = filled
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  // `outlined` was accepted by callers but only `.outline` exists in CSS, which rendered
  // an unstyled, near-invisible button. Normalise so both spellings resolve.
  const resolvedVariant = variant === "outlined" ? "outline" : variant;
  const isDisabled = disabled || loading;

  const renderIcon = () => {
    if (!iconName) return null;

    return (
      <span
        className="material-symbols-rounded"
        aria-hidden="true"
        style={{
          fontVariationSettings: `'FILL' ${iconFill}, 'wght' 500, 'GRAD' 0, 'opsz' 20`,
        }}
      >
        {iconName}
      </span>
    );
  };

  return (
    <button
      type={type}
      className={`custom-button ${resolvedVariant} ${className}`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="button-content">
        {loading && <span className="button-spinner" aria-hidden="true" />}
        {!loading && iconName && iconPosition === "left" && (
          <span className="button-icon left">{renderIcon()}</span>
        )}
        <span className="button-text body">{children}</span>
        {!loading && iconName && iconPosition === "right" && (
          <span className="button-icon right">{renderIcon()}</span>
        )}
      </span>
    </button>
  );
};

export default Button;
