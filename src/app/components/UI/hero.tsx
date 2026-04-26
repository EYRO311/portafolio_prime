"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  SiNodedotjs,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiAngular,
  SiReact,
  SiPython,
} from "react-icons/si";
import { Press_Start_2P, VT323 } from "next/font/google";

import { cn } from "@/src/app/components/lib/utils";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });
const terminal = VT323({ subsets: ["latin"], weight: "400" });

export type TechIconId =
  | "node"
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "next"
  | "angular"
  | "react"
  | "python";

const TECH_ICON_MAP: Record<TechIconId, React.ComponentType<any>> = {
  node: SiNodedotjs,
  html: SiHtml5,
  css: SiCss3,
  javascript: SiJavascript,
  typescript: SiTypescript,
  next: SiNextdotjs,
  angular: SiAngular,
  react: SiReact,
  python: SiPython,
};

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  introText?: string;
  name: string;
  roles: string[];
  roleDelayMs?: number;
  eraseDelayMs?: number;
  description: React.ReactNode;
  tech?: TechIconId[];
  techVelocity?: number;
  forceThemeClass?: "dark" | "light";
}

export function Hero({
  id = "hero",
  introText = "Hi, I'm",
  name,
  roles,
  roleDelayMs = 2000,
  eraseDelayMs = 800,
  description,
  tech = ["node", "html", "next", "typescript", "css", "javascript", "angular", "react", "python"],
  techVelocity = 60,
  forceThemeClass,
  className,
  ...props
}: HeroProps) {
  const { darkMode } = useTheme();
  const themeClass = forceThemeClass ?? (darkMode ? "dark" : "light");

  const sequence = React.useMemo<(string | number)[]>(() => {
    const seq: (string | number)[] = [];
    roles.forEach((t) => {
      seq.push(t, roleDelayMs, "", eraseDelayMs);
    });
    return seq;
  }, [roles, roleDelayMs, eraseDelayMs]);

  const renderIcons = (groupKey: string) =>
    tech.map((id, idx) => {
      const Icon = TECH_ICON_MAP[id];
      return (
        <span className="tech-pair" key={`${groupKey}-${id}-${idx}`} aria-label={id} title={id}>
          <Icon />
        </span>
      );
    });

  const durationSec = React.useMemo(() => {
    const v = Math.max(10, Math.min(140, techVelocity));
    return (140 / v) * 10;
  }, [techVelocity]);

  return (
    <>
      <section
        id={id}
        className={cn("hero", themeClass, className)}
        style={{ position: "relative" }}
        {...props}
      >
        <div className="hero-inner">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className={cn("intro", pixel.className)}
          >
            {introText} <span className="name">{name}</span>
          </motion.p>

          <TypeAnimation
            sequence={sequence}
            wrapper="h1"
            cursor
            repeat={Infinity}
            className={cn("title", terminal.className)}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.55 }}
            className="description"
          >
            {description}
          </motion.p>

          <div className="tech-scroll-container">
            <div className="tech-icon-scroll">
              <div
                className="marquee-track"
                style={{ ["--marquee-duration" as any]: `${durationSec}s` } as React.CSSProperties}
              >
                <div className="marquee-group">{renderIcons("A")}</div>
                <div className="marquee-group" aria-hidden="true">
                  {renderIcons("B")}
                </div>
              </div>
            </div>
          </div>

          <div className={cn("hint", pixel.className)}>Press Start • Scroll</div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 2rem 3rem;
          position: relative;
          z-index: 1;
          background: transparent;
        }

        /* CRT overlay (scanlines + vignette + flicker) */
        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(60% 60% at 50% 40%, rgba(22, 138, 200, 0.10), transparent 60%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, rgba(0, 0, 0, 0) 1px);
          background-size: auto, 100% 4px;
          opacity: 0.28;
          mix-blend-mode: overlay;
          animation: crtFlicker 5.5s infinite;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.35) 90%);
          opacity: 0.6;
        }

        @keyframes crtFlicker {
          0% { opacity: 0.22; }
          5% { opacity: 0.28; }
          10% { opacity: 0.24; }
          15% { opacity: 0.30; }
          20% { opacity: 0.25; }
          100% { opacity: 0.28; }
        }

        .hero-inner {
          width: 100%;
          z-index: 2;
          position: relative;
          padding: 2.4rem 1.8rem;
          border-radius: 16px;
          border: 1px solid rgba(22, 138, 200, 0.18);
          box-shadow:
            0 0 0 1px rgba(22, 138, 200, 0.06),
            0 18px 60px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(2px);
        }

        .intro {
          font-size: 1.15rem;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .name {
          color: rgba(22, 138, 200, 0.95);
          font-weight: 800;
          text-shadow: 0 0 14px rgba(22, 138, 200, 0.35);
        }

        /* ✅ TITULO CAMBIANTE (GRANDE como imagen 2) */
        .title {
          font-size: clamp(4.2rem, 12vw, 9rem);
          line-height: 0.95;
          margin: 0.55rem 0 0.2rem;
          font-weight: 900;
          letter-spacing: 0px;
          text-transform: none;

          /* glow controlado */
          text-shadow: 0 0 14px rgba(22, 138, 200, 0.30);

          /* evita brincos cuando cambia el texto */
          min-height: 1.1em;
        }

        .description {
          max-width: 700px;
          margin: 20px auto 0;
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.92;
        }

        .tech-scroll-container {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          width: 100%;
          max-width: 1100px;
          margin: 44px auto 0;
          overflow: hidden;
          padding: 1.2rem 0;
          position: relative;
        }

        .tech-icon-scroll {
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          align-items: center;
          gap: 3rem;
          will-change: transform;
          animation: marquee var(--marquee-duration) linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-group {
          display: inline-flex;
          align-items: center;
          gap: 3rem;
          padding-right: 3rem;
        }

        /* estilo tipo imagen 2 para los iconos */
        .tech-pair {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          font-size: 1.5rem;
          opacity: 0.9;
          transition: opacity 0.25s ease, transform 0.25s ease, color 0.25s ease;
          flex-shrink: 0;
        }

        .tech-pair:hover {
          opacity: 1;
          transform: scale(1.08);
          color: rgba(22, 138, 200, 1);
        }

        .hint {
          margin-top: 18px;
          font-size: 0.75rem;
          opacity: 0.55;
          letter-spacing: 1px;
        }

        /* ===== Theme ===== */
        .hero.dark { color: #ffffff; }
        .hero.dark .hero-inner { background: rgba(0, 0, 0, 0.18); }
        .hero.dark .intro,
        .hero.dark .title,
        .hero.dark .description { color: #ffffff; }
        .hero.dark .tech-pair { color: rgba(255, 255, 255, 0.85); }

        .hero.light { color: #0b0b0b; }
        .hero.light .hero-inner { background: rgba(255, 255, 255, 0.35); }
        .hero.light .intro,
        .hero.light .title,
        .hero.light .description { color: #0b0b0b; }
        .hero.light .tech-pair {
          background: rgba(0, 0, 0, 0.06);
          color: rgba(0, 0, 0, 0.85);
        }

        @media (max-width: 768px) {
          .hero-inner { padding: 2rem 1.2rem; }

          /* ✅ en móvil sigue grande, pero controlado */
          .title {
            font-size: clamp(3rem, 14vw, 5rem);
            line-height: 1;
            min-height: 1.15em;
          }

          .description {
            font-size: 1rem;
            padding: 0 0.5rem;
          }

          .marquee-group,
          .marquee-track {
            gap: 1.2rem;
          }

          .tech-pair {
            font-size: 1.2rem;
            padding: 0.4rem 1rem;
          }
        }
      `}</style>
    </>
  );
}