"use client";

import { useTheme } from "@/src/app/components/utils/ThemeContext";
import { useLocale } from "@/src/app/components/utils/LocaleContext";

export default function LocaleToggle() {
  const { darkMode } = useTheme();
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      onClick={toggleLocale}
      aria-label={locale === "en" ? "Cambiar a español" : "Switch to English"}
      style={{
        position: "fixed",
        right: "1.25rem",
        bottom: "4.25rem",
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
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.5px",
        transition: "all 0.2s ease",
        boxShadow: darkMode
          ? "0 0 16px rgba(0,229,255,0.15)"
          : "0 4px 20px rgba(124,58,237,0.15)",
      }}
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
