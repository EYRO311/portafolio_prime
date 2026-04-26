"use client";

import { useTheme } from "@/src/app/components/utils/ThemeContext";

export default function TechnoBackground() {
  const { darkMode: dark } = useTheme();

  const blue = "rgba(30,139,198,";
  const gridColor = dark ? `${blue}0.07)` : `${blue}0.09)`;
  const glowA = dark ? `${blue}0.10)` : `${blue}0.07)`;
  const glowB = dark ? `${blue}0.06)` : `${blue}0.04)`;
  const bg = dark ? "#000000" : "#f6f8fc";

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: bg,
        transition: "background 0.3s",
        overflow: "hidden",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            `linear-gradient(${gridColor} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: "44px 44px",
        }}
      />

      {/* Dot intersections overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${dark ? "rgba(30,139,198,0.35)" : "rgba(30,139,198,0.25)"} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: "-1px -1px",
        }}
      />

      {/* Top-right glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowA} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Bottom-left glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowB} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Corner bracket — top-left */}
      <svg
        style={{ position: "absolute", top: 28, left: 28, opacity: dark ? 0.18 : 0.12 }}
        width="48" height="48" viewBox="0 0 48 48" fill="none"
      >
        <path d="M0 24 L0 0 L24 0" stroke="#1e8bc6" strokeWidth="1.5" />
      </svg>

      {/* Corner bracket — bottom-right */}
      <svg
        style={{ position: "absolute", bottom: 28, right: 28, opacity: dark ? 0.18 : 0.12 }}
        width="48" height="48" viewBox="0 0 48 48" fill="none"
      >
        <path d="M48 24 L48 48 L24 48" stroke="#1e8bc6" strokeWidth="1.5" />
      </svg>

      {/* Horizontal scan line (subtle) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "30%",
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${dark ? "rgba(30,139,198,0.18)" : "rgba(30,139,198,0.12)"} 30%, ${dark ? "rgba(30,139,198,0.18)" : "rgba(30,139,198,0.12)"} 70%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
