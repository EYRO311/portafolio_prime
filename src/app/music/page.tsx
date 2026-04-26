import type { Metadata } from "next";
import MusicClient from "./MusicClient";

export const metadata: Metadata = {
  title: "Music Dashboard | EYRO",
  description: "Spotify dashboard with top artists, top tracks, playback and playlists",
};

export default function MusicPage() {
  return (
    <main className="min-h-screen px-6 py-24">
      <section className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-4xl font-bold">Music Dashboard</h1>
        <p className="mb-8 max-w-2xl opacity-80">
          Conecta tu cuenta de Spotify para ver top artists, top tracks, historial
          reciente, reproducción actual y playlists.
        </p>

        <MusicClient />
      </section>
    </main>
  );
}