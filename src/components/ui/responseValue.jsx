import React from "react";

/** Renders a single questionnaire response value based on question type */
const ResponseValue = ({ response }) => {
  const { raw_value, display_value, type, severity_normalized } = response;

  if (raw_value === null || raw_value === undefined) {
    return <span className="qd-response-value caption qd-skipped">Not answered</span>;
  }

  // Rating: show colored pill
  if (type === "rating") {
    const color =
      severity_normalized <= 0.25 ? "success" :
      severity_normalized <= 0.5 ? "warning" :
      severity_normalized <= 0.75 ? "warning" : "error";
    return (
      <span className={`qd-severity-pill ${color}`}>
        {display_value || raw_value}
      </span>
    );
  }

  // Multi-select, body-diagram: tag pills
  if (type === "multi-select" || type === "body-diagram") {
    const values = Array.isArray(display_value)
      ? display_value
      : Array.isArray(raw_value)
      ? raw_value
      : [display_value || raw_value];
    return (
      <div className="qd-tags">
        {values.map((v, i) => (
          <span key={i} className="qd-tag">{typeof v === "string" ? v : String(v)}</span>
        ))}
      </div>
    );
  }

  // Color-chart: show as tag with the value
  if (type === "color-chart") {
    const values = Array.isArray(display_value) ? display_value : [display_value || raw_value];
    return (
      <div className="qd-tags">
        {values.map((v, i) => (
          <span key={i} className="qd-tag">{typeof v === "string" ? v : String(v)}</span>
        ))}
      </div>
    );
  }

  // Slider: value with unit
  if (type === "slider") {
    return (
      <span className="qd-response-value body-semibold">
        {display_value || raw_value}
      </span>
    );
  }

  // Single-select, text, default
  return (
    <span className="qd-response-value body-semibold">
      {display_value || String(raw_value)}
    </span>
  );
};

export default ResponseValue;
