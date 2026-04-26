"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

export default function ParticlesBackground() {
  const { darkMode } = useTheme();

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 }, // ✅ toda la app, detrás
        background: {
          color: { value: darkMode ? "#000000" : "#ffffff" }, // ✅ modo oscuro/claro global
        },
        particles: {
          number: { value: 70, density: { enable: true, area: 800 } },
          color: { value: "#249be7" },
          links: {
            enable: true,
            color: darkMode ? "#ffffff" : "#000000",
            distance: 100,
            opacity: 0.8,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            outModes: { default: "bounce" },
          },
          opacity: { value: 1 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
}