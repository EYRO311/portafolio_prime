"use client";

import * as React from "react";
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
import { cn } from "@/src/app/components/lib/utils";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

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

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  name: string;
  roles: string[];
  description: React.ReactNode;
  tech?: TechIconId[];
}

export function Hero({
  id = "hero",
  name,
  roles,
  description,
  tech = ["node", "html", "next", "typescript", "css", "javascript", "angular", "react", "python"],
  className,
  ...props
}: HeroProps) {
  const { darkMode: dark } = useTheme();
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setRoleIndex((p) => (p + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <>
      <section id={id} className={cn("formal-hero", className)} {...props}>
        <div className="formal-container" data-dark={dark ? "true" : "false"}>

          {/* Columna izquierda */}
          <motion.div
            className="formal-content"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className="formal-greeting">Software Developer</p>
            <h1 className="formal-name">{name}</h1>

            <div className="formal-role-wrapper">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="formal-role"
              >
                {roles[roleIndex]}
              </motion.span>
            </div>

            <p className="formal-description">{description}</p>

            <div className="formal-actions">
              <a href="#projects" className="btn-primary">Ver proyectos</a>
              <a href="/music" className="btn-secondary">Ver música</a>
            </div>
          </motion.div>

          {/* Columna derecha — tech grid */}
          <motion.div
            className="formal-tech"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <p className="tech-label">Stack tecnológico</p>
            <div className="tech-grid">
              {tech.map((techId) => {
                const Icon = TECH_ICON_MAP[techId];
                return (
                  <div key={techId} className="tech-chip" title={TECH_NAMES[techId]}>
                    <Icon aria-hidden />
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
        }

        .formal-container[data-dark="true"] {
          border: 1px solid rgba(30,139,198,0.22);
          background: rgba(0,0,0,0.22);
          box-shadow: 0 20px 70px rgba(0,0,0,0.35);
        }
        .formal-container[data-dark="false"] {
          border: 1px solid rgba(30,139,198,0.18);
          background: rgba(255,255,255,0.55);
          box-shadow: 0 20px 70px rgba(0,0,0,0.10);
        }

        .formal-content { display: flex; flex-direction: column; gap: 1.2rem; }

        .formal-greeting {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1e8bc6;
          margin: 0;
        }

        .formal-name {
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .formal-container[data-dark="true"] .formal-name { color: #ffffff; }
        .formal-container[data-dark="false"] .formal-name { color: #0a0a0a; }

        .formal-role-wrapper { height: 2rem; display: flex; align-items: center; }

        .formal-role {
          display: inline-block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e8bc6;
          letter-spacing: 0.3px;
        }

        .formal-description {
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
          max-width: 480px;
        }
        .formal-container[data-dark="true"] .formal-description { color: rgba(255,255,255,0.80); }
        .formal-container[data-dark="false"] .formal-description { color: rgba(0,0,0,0.70); }

        .formal-actions { display: flex; gap: 0.9rem; flex-wrap: wrap; margin-top: 0.4rem; }

        .btn-primary {
          display: inline-flex; align-items: center;
          padding: 0.65rem 1.5rem; border-radius: 8px;
          font-size: 0.92rem; font-weight: 600; text-decoration: none;
          background: #1e8bc6; color: #fff; border: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #166fa0; transform: translateY(-1px); }

        .btn-secondary {
          display: inline-flex; align-items: center;
          padding: 0.65rem 1.5rem; border-radius: 8px;
          font-size: 0.92rem; font-weight: 600; text-decoration: none;
          background: transparent;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .formal-container[data-dark="true"] .btn-secondary {
          border: 1.5px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.9);
        }
        .formal-container[data-dark="false"] .btn-secondary {
          border: 1.5px solid rgba(0,0,0,0.20); color: rgba(0,0,0,0.80);
        }
        .btn-secondary:hover { border-color: #1e8bc6; color: #1e8bc6; transform: translateY(-1px); }

        .formal-tech { display: flex; flex-direction: column; gap: 1rem; }

        .tech-label {
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: #1e8bc6; margin: 0; opacity: 0.85;
        }

        .tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }

        .tech-chip {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 0.85rem; border-radius: 10px;
          font-size: 0.80rem; font-weight: 500;
          transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s;
          cursor: default;
        }
        .formal-container[data-dark="true"] .tech-chip {
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.82);
        }
        .formal-container[data-dark="false"] .tech-chip {
          border: 1px solid rgba(0,0,0,0.09);
          background: rgba(0,0,0,0.04);
          color: rgba(0,0,0,0.78);
        }
        .tech-chip:hover { border-color: #1e8bc6; color: #1e8bc6; transform: translateY(-1px); }
        .formal-container[data-dark="true"] .tech-chip:hover { background: rgba(30,139,198,0.12); }
        .formal-container[data-dark="false"] .tech-chip:hover { background: rgba(30,139,198,0.07); }
        .tech-chip svg { font-size: 1.1rem; flex-shrink: 0; }

        @media (max-width: 768px) {
          .formal-container { grid-template-columns: 1fr; gap: 2.5rem; padding: 2rem 1.5rem; }
          .formal-name { font-size: clamp(2.2rem, 8vw, 3rem); }
        }
      `}</style>
    </>
  );
}
