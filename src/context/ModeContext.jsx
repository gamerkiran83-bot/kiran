import React, { createContext, useContext, useState, useEffect } from "react";

const ModeContext = createContext(null);

export const ModeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    try {
      return localStorage.getItem("exploro_mode") || "simple";
    } catch {
      return "simple";
    }
  });

  const setMode = (newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem("exploro_mode", newMode);
    } catch {}
  };

  const advanced = mode === "advanced";

  return (
    <ModeContext.Provider value={{ mode, setMode, advanced }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    return {
      mode: "simple",
      setMode: () => {},
      advanced: false,
    };
  }
  return context;
};
