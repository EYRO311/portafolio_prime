"use client";

import * as React from "react";

type Mode = "formal" | "relaxed";

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = React.createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>("formal");

  React.useEffect(() => {
    const stored = localStorage.getItem("portfolioMode") as Mode | null;
    if (stored === "formal" || stored === "relaxed") {
      setMode(stored);
    }
  }, []);

  const toggleMode = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === "formal" ? "relaxed" : "formal";
      localStorage.setItem("portfolioMode", next);
      return next;
    });
  }, []);

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = React.useContext(ModeContext);
  if (!ctx) throw new Error("useMode debe usarse dentro de ModeProvider");
  return ctx;
}
