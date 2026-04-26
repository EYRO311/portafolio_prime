"use client";

// ── todos los imports al inicio ──────────────────────────────────────────────
import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  SiNodedotjs,
  SiHtml5,
  SiCss,
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
import { useMode } from "@/src/app/components/utils/ModeContext";

// ── dynamic imports (después de todos los import estáticos) ──────────────────
// TypeAnimation solo se usa en modo relajado; no bloquea el bundle inicial
const TypeAnimation = dynamic(
  () => import("react-type-animation").then((m) => ({ default: m.TypeAnimation })),
  { ssr: false }
);

// ── fuentes pixel (solo modo relajado) ───────────────────────────────────────
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });
const terminal = VT323({ subsets: ["latin"], weight: "400" });

// ── tipos ────────────────────────────────────────────────────────────────────
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
  css: SiCss,
  javascript: SiJavascript,
  typescript: SiTypescript,
  next: SiNextdotjs,
  angular: SiAngular,
  react: SiReact,
  python: SiPython,
};

const TECH_NAMES: Record<TechIconId, string> = {
  node: "Node.js",
  html: "HTML5",
  css: "CSS3",
  javascript: "JavaScript",
  typescript: "TypeScript",
  next: "Next.js",
  angular: "Angular",
  react: "React",
  python: "Python",
};

// ── props ─────────────────────────────────────────────────────────────────────
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
  techCopies?: number;
  forceThemeClass?: "dark" | "light";
}

// ── componente principal ──────────────────────────────────────────────────────
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
  const { mode } = useMode();
  const themeClass = forceThemeClass ?? (darkMode ? "dark" : "light");

  const sequence = React.useMemo<(string | number)[]>(() => {
    const seq: (string | number)[] = [];
    roles.forEach((t) => { seq.push(t, roleDelayMs, "", eraseDelayMs); });
    return seq;
  }, [roles, roleDelayMs, eraseDelayMs]);

  const durationSec = React.useMemo(() => {
    const v = Math.max(10, Math.min(140, techVelocity));
    return (140 / v) * 10;
  }, [techVelocity]);

  const renderIcons = (groupKey: string) =>
    tech.map((techId, idx) => {
      const Icon = TECH_ICON_MAP[techId];
      return (
        <span className="tech-pair" key={`${groupKey}-${techId}-${idx}`} aria-label={techId} title={techId}>
          <Icon />
        </span>
      );
    });

  if (mode === "formal") {
    return (
      <FormalHero
        id={id}
        name={name}
        roles={roles}
        description={description}
        tech={tech}
        darkMode={darkMode}
        className={className}
        {...props}
      />
    );
  }

  // ── modo relajado ────────────────────────────────────────────────────────────
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
                <div className="marquee-group" aria-hidden="true">{renderIcons("B")}</div>
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
        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(60% 60% at 50% 40%, rgba(22,138,200,0.10), transparent 60%),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px);
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
          0%   { opacity: 0.22; }
          5%   { opacity: 0.28; }
          10%  { opacity: 0.24; }
          15%  { opacity: 0.30; }
          20%  { opacity: 0.25; }
          100% { opacity: 0.28; }
        }
        .hero-inner {
          width: 100%;
          z-index: 2;
          position: relative;
          padding: 2.4rem 1.8rem;
          border-radius: 16px;
          border: 1px solid rgba(22,138,200,0.18);
          box-shadow: 0 0 0 1px rgba(22,138,200,0.06), 0 18px 60px rgba(0,0,0,0.22);
          backdrop-filter: blur(2px);
        }
        .intro { font-size: 1.15rem; margin: 0; letter-spacing: 0.5px; }
        .name  { color: rgba(22,138,200,0.95); font-weight: 800; text-shadow: 0 0 14px rgba(22,138,200,0.35); }
        .title {
          font-size: clamp(4.2rem, 12vw, 9rem);
          line-height: 0.95;
          margin: 0.55rem 0 0.2rem;
          font-weight: 900;
          text-shadow: 0 0 14px rgba(22,138,200,0.30);
          min-height: 1.1em;
        }
        .description { max-width: 700px; margin: 20px auto 0; font-size: 1.1rem; line-height: 1.6; opacity: 0.92; }
        .tech-scroll-container {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          width: 100%;
          max-width: 1100px;
          margin: 44px auto 0;
          overflow: hidden;
          padding: 1.2rem 0;
        }
        .tech-icon-scroll { overflow: hidden; white-space: nowrap; }
        .marquee-track {
          display: flex;
          width: max-content;
          align-items: center;
          gap: 3rem;
          will-change: transform;
          animation: marquee var(--marquee-duration) linear infinite;
        }
        @keyframes marquee {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-group { display: inline-flex; align-items: center; gap: 3rem; padding-right: 3rem; }
        .tech-pair {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.2rem;
          background: rgba(255,255,255,0.08);
          border-radius: 6px;
          font-size: 1.5rem;
          opacity: 0.9;
          transition: opacity 0.25s, transform 0.25s, color 0.25s;
          flex-shrink: 0;
        }
        .tech-pair:hover { opacity: 1; transform: scale(1.08); color: rgba(22,138,200,1); }
        .hint { margin-top: 18px; font-size: 0.75rem; opacity: 0.55; letter-spacing: 1px; }

        .hero.dark { color: #ffffff; }
        .hero.dark .hero-inner { background: rgba(0,0,0,0.18); }
        .hero.dark .intro,
        .hero.dark .title,
        .hero.dark .description { color: #ffffff; }
        .hero.dark .tech-pair { color: rgba(255,255,255,0.85); }

        .hero.light { color: #0b0b0b; }
        .hero.light .hero-inner { background: rgba(255,255,255,0.35); }
        .hero.light .intro,
        .hero.light .title,
        .hero.light .description { color: #0b0b0b; }
        .hero.light .tech-pair { background: rgba(0,0,0,0.06); color: rgba(0,0,0,0.85); }

        @media (max-width: 768px) {
          .hero-inner { padding: 2rem 1.2rem; }
          .title { font-size: clamp(3rem, 14vw, 5rem); line-height: 1; min-height: 1.15em; }
          .description { font-size: 1rem; padding: 0 0.5rem; }
          .marquee-group, .marquee-track { gap: 1.2rem; }
          .tech-pair { font-size: 1.2rem; padding: 0.4rem 1rem; }
        }
      `}</style>
    </>
  );
}

// ── modo formal ───────────────────────────────────────────────────────────────
interface FormalHeroProps {
  id?: string;
  name: string;
  roles: string[];
  description: React.ReactNode;
  tech?: TechIconId[];
  darkMode: boolean;
  className?: string;
  [key: string]: any;
}

function FormalHero({ id = "hero", name, roles, description, tech = [], darkMode: dark, className, ...props }: FormalHeroProps) {
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setRoleIndex((p) => (p + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <>
      <section id={id} className={cn("formal-hero", className)} {...props}>
        <div className="formal-container">
          <motion.div className="formal-content" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="formal-greeting">Software Developer</p>
            <h1 className="formal-name">{name}</h1>
            <div className="formal-role-wrapper">
              <AnimatedRole key={roleIndex} role={roles[roleIndex] ?? ""} />
            </div>
            <p className="formal-description">{description}</p>
            <div className="formal-actions">
              <a href="#projects" className="btn-primary">Ver proyectos</a>
              <a href="#music" className="btn-secondary">Ver música</a>
            </div>
          </motion.div>

          <motion.div className="formal-tech" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <p className="tech-label">Stack tecnológico</p>
            <div className="tech-grid">
              {tech.map((techId) => {
                const Icon = TECH_ICON_MAP[techId];
                return (
                  <div key={techId} className="tech-chip" title={TECH_NAMES[techId]}>
                    <Icon />
                    <span>{TECH_NAMES[techId]}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .formal-hero {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7rem 2rem 4rem;
          position: relative;
          z-index: 1;
          background: transparent;
        }
        .formal-container {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          border: 1px solid ${dark ? "rgba(30,139,198,0.22)" : "rgba(30,139,198,0.18)"};
          background: ${dark ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.55)"};
          box-shadow: 0 20px 70px ${dark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.10)"};
        }
        .formal-content { display: flex; flex-direction: column; gap: 1.2rem; }
        .formal-greeting { font-size: 0.85rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #1e8bc6; margin: 0; }
        .formal-name { font-size: clamp(2.8rem, 5vw, 4.2rem); font-weight: 800; margin: 0; line-height: 1.1; letter-spacing: -1px; color: ${dark ? "#ffffff" : "#0a0a0a"}; }
        .formal-role-wrapper { height: 2.2rem; display: flex; align-items: center; }
        .formal-description { font-size: 1.05rem; line-height: 1.7; margin: 0; opacity: 0.82; max-width: 480px; color: ${dark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.75)"}; }
        .formal-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .btn-primary {
          display: inline-flex; align-items: center;
          padding: 0.7rem 1.6rem; border-radius: 8px;
          font-size: 0.95rem; font-weight: 600; text-decoration: none;
          background: #1e8bc6; color: #ffffff;
          transition: background 0.2s, transform 0.15s; border: none;
        }
        .btn-primary:hover { background: #166fa0; transform: translateY(-1px); }
        .btn-secondary {
          display: inline-flex; align-items: center;
          padding: 0.7rem 1.6rem; border-radius: 8px;
          font-size: 0.95rem; font-weight: 600; text-decoration: none;
          border: 1.5px solid ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)"};
          color: ${dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)"};
          background: transparent;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .btn-secondary:hover { background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}; border-color: #1e8bc6; color: #1e8bc6; transform: translateY(-1px); }
        .formal-tech { display: flex; flex-direction: column; gap: 1.2rem; }
        .tech-label { font-size: 0.80rem; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #1e8bc6; margin: 0; opacity: 0.85; }
        .tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; }
        .tech-chip {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.65rem 0.9rem; border-radius: 10px;
          font-size: 0.82rem; font-weight: 500;
          border: 1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)"};
          background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
          color: ${dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)"};
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          cursor: default;
        }
        .tech-chip:hover { border-color: #1e8bc6; background: ${dark ? "rgba(30,139,198,0.12)" : "rgba(30,139,198,0.07)"}; color: #1e8bc6; transform: translateY(-1px); }
        .tech-chip svg { font-size: 1.15rem; flex-shrink: 0; }
        @media (max-width: 768px) {
          .formal-container { grid-template-columns: 1fr; gap: 2.5rem; padding: 2rem 1.5rem; }
          .formal-name { font-size: clamp(2.2rem, 8vw, 3rem); }
        }
      `}</style>
    </>
  );
}

function AnimatedRole({ role }: { role: string }) {
  return (
    <motion.span
      key={role}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      style={{ fontSize: "1.15rem", fontWeight: 600, color: "#1e8bc6", letterSpacing: "0.3px" }}
    >
      {role}
    </motion.span>
  );
}
