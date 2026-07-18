"use client";

import { RETRO, pixelFont, retroMono, retroFontVars } from "@/src/app/components/music/retroTheme";
import MusicClient from "./MusicClient";

export default function MusicDashboardWrapper() {
  return (
    <main
      className={`${retroFontVars} min-h-screen px-6 py-24`}
      style={{ background: RETRO.bgGradient, color: RETRO.text }}
    >
      <section className={`${retroMono.className} mx-auto max-w-7xl`}>
        <h1
          className={pixelFont.className}
          style={{ fontSize: "2rem", marginBottom: "0.75rem", color: RETRO.cyan, textShadow: `3px 3px 0 ${RETRO.pink}` }}
        >
          Music Dashboard
        </h1>
        <p className="mb-8 max-w-2xl" style={{ fontSize: "1.1rem", color: RETRO.textMuted }}>
          Conecta tu cuenta de Spotify para ver top artists, top tracks, historial
          reciente, reproducción actual y playlists.
        </p>

        <MusicClient />
      </section>
    </main>
  );
}
