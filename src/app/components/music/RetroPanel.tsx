import type { ReactNode } from "react";
import { RETRO, pixelFont } from "@/src/app/components/music/retroTheme";

type RetroPanelProps = {
  title: string;
  accent: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export default function RetroPanel({ title, accent, children, actions, className }: RetroPanelProps) {
  return (
    <section
      className={className}
      style={{
        border: `3px solid ${accent}`,
        borderRadius: 12,
        background: RETRO.panel,
        boxShadow: `5px 5px 0 ${accent}`,
        overflow: "hidden",
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2"
        style={{ padding: "0.7rem 1.1rem", background: accent }}
      >
        <span
          className={pixelFont.className}
          style={{ fontSize: "0.68rem", color: "#160a26", lineHeight: 1.4, letterSpacing: "0.5px" }}
        >
          {title}
        </span>
        {actions}
      </div>
      <div style={{ padding: "1.2rem" }}>{children}</div>
    </section>
  );
}
