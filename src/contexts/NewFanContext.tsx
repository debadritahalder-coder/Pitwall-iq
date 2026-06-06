import React, { createContext, useContext, useState, useEffect } from "react";

interface NewFanContextType {
  isNewFanMode: boolean;
  toggleNewFanMode: () => void;
}

const NewFanContext = createContext<NewFanContextType | undefined>(undefined);

export function NewFanProvider({ children }: { children: React.ReactNode }) {
  const [isNewFanMode, setIsNewFanMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pitwall_new_fan_mode");
    if (saved === "true") {
      setIsNewFanMode(true);
    }
  }, []);

  const toggleNewFanMode = () => {
    setIsNewFanMode((prev) => {
      const next = !prev;
      localStorage.setItem("pitwall_new_fan_mode", String(next));
      return next;
    });
  };

  return (
    <NewFanContext.Provider value={{ isNewFanMode, toggleNewFanMode }}>
      {children}
    </NewFanContext.Provider>
  );
}

export function useNewFanMode() {
  const context = useContext(NewFanContext);
  if (context === undefined) {
    throw new Error("useNewFanMode must be used within a NewFanProvider");
  }
  return context;
}
