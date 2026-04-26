"use client";

import { useTheme } from "@/src/app/components/utils/ThemeContext";
import MusicClient from "./MusicClient";

export default function MusicDashboardWrapper() {
  const { darkMode: dark } = useTheme();

  return (
    <main
      className="min-h-screen px-6 py-24"
      style={{ color: dark ? "#ffffff" : "#0a0a0a" }}
    >
      <section className="mx-auto max-w-7xl">
        <h1
          className="mb-4 text-4xl font-bold"
          style={{ color: dark ? "#ffffff" : "#0a0a0a" }}
        >
          Music Dashboard
        </h1>
        <p
          className="mb-8 max-w-2xl"
          style={{ color: dark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.60)" }}
        >
          Conecta tu cuenta de Spotify para ver top artists, top tracks, historial
          reciente, reproducción actual y playlists.
        </p>

        <MusicClient />
      </section>
    </main>
  );
}
