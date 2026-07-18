"use client";

import { ReactNode } from "react";
import { RETRO, pixelFont, retroMono, retroFontVars } from "@/src/app/components/music/retroTheme";

type MusicPageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function MusicPageShell({
  title,
  description,
  actions,
  children,
}: MusicPageShellProps) {
  return (
    <main
      className={`${retroFontVars} min-h-screen p-6`}
      style={{ background: RETRO.bgGradient, color: RETRO.text }}
    >
      <section className={`${retroMono.className} mx-auto max-w-6xl pt-8`}>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={pixelFont.className} style={{ fontSize: "1.5rem", color: RETRO.pink, textShadow: `2px 2px 0 ${RETRO.cyan}` }}>
              {title}
            </h1>
            {description ? (
              <p className="mt-2" style={{ fontSize: "1.05rem", color: RETRO.textMuted }}>
                {description}
              </p>
            ) : null}
          </div>

          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        {children}
      </section>
    </main>
  );
}
