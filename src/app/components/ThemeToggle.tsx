"use client";

import { useTheme } from "@/src/app/components/utils/ThemeContext";

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        position: "fixed",
        right: "1.25rem",
        bottom: "1.25rem",
        zIndex: 9999,
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        border: darkMode
          ? "1px solid rgba(0,229,255,0.3)"
          : "1px solid rgba(124,58,237,0.25)",
        backdropFilter: "blur(12px)",
        background: darkMode
          ? "rgba(8,8,24,0.88)"
          : "rgba(255,255,255,0.88)",
        color: darkMode ? "#00e5ff" : "#7c3aed",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        boxShadow: darkMode
          ? "0 0 16px rgba(0,229,255,0.15)"
          : "0 4px 20px rgba(124,58,237,0.15)",
      }}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
