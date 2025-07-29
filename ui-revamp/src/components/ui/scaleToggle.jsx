import React, { useContext } from "react";
import { ScaleContext } from "../../context/ScaleContext.jsx";

const ScaleToggle = () => {
  const { scale, setScale } = useContext(ScaleContext);

  const handleChange = () => {
    const next = scale === "small" ? "default" : scale === "default" ? "large" : "small";
    setScale(next);
  };

  return (
    <button onClick={handleChange}>
      Change Scale (Current: {scale})
    </button>
  );
};

export default ScaleToggle;
