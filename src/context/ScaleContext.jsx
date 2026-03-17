import React, { createContext, useState, useEffect } from "react";

export const ScaleContext = createContext();

export const ScaleProvider = ({ children }) => {
  const [scale, setScale] = useState("default");

  // Set initial scale based on screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setScale(mediaQuery.matches ? "large" : "default");

    // Optional: listen for screen resize
    const handleResize = () => {
      setScale(window.innerWidth >= 768 ? "large" : "default");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScaleContext.Provider value={{ scale, setScale }}>
      <div data-scale={scale}>{children}</div>
    </ScaleContext.Provider>
  );
};