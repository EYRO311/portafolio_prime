"use client";

import { useEffect, useState } from "react";
import MusicPageShell from "@/src/app/components/music/MusicPageShell";
import TrackRowCard from "@/src/app/components/music/TrackRowCard";
import { RETRO } from "@/src/app/components/music/retroTheme";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
  playedAt?: string | null;
};

type ApiResponse = {
  items: Track[];
  cursors: {
    after?: string;
    before?: string;
  } | null;
  next: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function HistoryPage() {
  const [items, setItems] = useState<Track[]>([]);
  const [before, setBefore] = useState<string | null>(null);
  const [nextBefore, setNextBefore] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_PATH = "/auth/spotify/recently_played";

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("limit", "20");
        if (before) params.set("before", before);

        const res = await fetch(`${API_PATH}?${params.toString()}`, {
          cache: "no-store",
        });

        const data: ApiResponse = await res.json();

        if (!res.ok) {
          throw new Error((data as any)?.error || "No se pudo cargar el historial");
        }

        setItems(data.items || []);
        setNextBefore(data.cursors?.before || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [before]);

  return (
    <MusicPageShell
      title="Historial reciente"
      description="Tus reproducciones más recientes desde Spotify."
      actions={
        <button
          onClick={() => setBefore(nextBefore)}
          disabled={!nextBefore || loading}
          className="rounded-lg px-4 py-2 text-sm disabled:opacity-40"
          style={{ border: `2px solid ${RETRO.pink}`, color: RETRO.pink }}
        >
          Ver más antiguas
        </button>
      }
    >
      {loading && <p style={{ color: RETRO.textSubtle }}>Cargando...</p>}

      <div className="grid gap-3">
        {items.map((track) => (
          <TrackRowCard
            key={`${track.id}-${track.playedAt}`}
            title={track.name}
            subtitle={track.artists}
            meta={formatDate(track.playedAt)}
            image={track.image}
            spotifyUrl={track.spotifyUrl}
          />
        ))}
      </div>
    </MusicPageShell>
  );
}
