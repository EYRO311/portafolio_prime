"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const COUNT = 70;
const LINK_DIST = 120;
const DOT_COLOR = "#249be7";
const SPEED = 1.5;

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useTheme();
  const darkRef = useRef(darkMode);

  // Sync darkMode into a ref so the animation loop reads it without restarting
  useEffect(() => {
    darkRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.5 + 0.8,
    }));

    let animId: number;

    const tick = () => {
      const dark = darkRef.current;
      ctx.clearRect(0, 0, W, H);

      // Background fill
      ctx.fillStyle = dark ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // Move & bounce
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      // Links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.65;
            ctx.strokeStyle = dark
              ? `rgba(255,255,255,${alpha})`
              : `rgba(0,0,0,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      ctx.fillStyle = DOT_COLOR;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []); // solo corre una vez, lee darkMode por ref

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        display: "block",
      }}
    />
  );
}
