"use client";

import { useTheme } from "@/src/app/components/utils/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {darkMode ? "☀️" : "🌙"}
      </button>

      <style jsx>{`
        .theme-toggle {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 9999;
          width: 52px;
          height: 52px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          background: rgba(0, 0, 0, 0.45);
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          background: rgba(0, 0, 0, 0.6);
        }

        :global(html.dark) .theme-toggle {
          background: rgba(255, 255, 255, 0.35);
          color: #000;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        :global(html.dark) .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.55);
        }
      `}</style>
    </>
  );
}