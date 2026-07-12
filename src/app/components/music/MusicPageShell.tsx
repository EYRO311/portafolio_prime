"use client";

import { ReactNode } from "react";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

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
  const { darkMode: dark } = useTheme();

  return (
    <main
      className="min-h-screen p-6"
      style={{ color: dark ? "#ffffff" : "#0a0a0a" }}
    >
      <section className="mx-auto max-w-6xl pt-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="text-3xl font-semibold"
              style={{ color: dark ? "#ffffff" : "#0a0a0a" }}
            >
              {title}
            </h1>
            {description ? (
              <p
                className="mt-1"
                style={{ color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)" }}
              >
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
