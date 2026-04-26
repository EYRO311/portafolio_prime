"use client";

import { useMode } from "@/src/app/components/utils/ModeContext";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

export default function ModeToggle() {
  const { mode, toggleMode } = useMode();
  const { darkMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      aria-label="Cambiar modo de presentación"
      title={mode === "formal" ? "Cambiar a modo relajado" : "Cambiar a modo formal"}
      style={{
        position: "fixed",
        right: "18px",
        bottom: "80px",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "999px",
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        transition: "all 0.2s ease",
        border: darkMode ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.12)",
        background: darkMode ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.65)",
        color: darkMode ? "#fff" : "#1a1a1a",
        boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
        letterSpacing: "0.3px",
      }}
    >
      {mode === "formal" ? "🎮 Relajado" : "💼 Formal"}
    </button>
  );
}
