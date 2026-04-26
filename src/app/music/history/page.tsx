"use client";

import { useEffect, useState } from "react";

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

  // ASUMIDO:
  // si tu carpeta route es /auth/spotify/recently_played usa este path.
  // si la renombraste a recently-played, cambia solo esta línea.
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
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Historial reciente</h1>
          <p className="opacity-70">Tus reproducciones más recientes desde Spotify.</p>
        </div>

        <button
          onClick={() => setBefore(nextBefore)}
          disabled={!nextBefore || loading}
          className="rounded-xl border px-4 py-2 disabled:opacity-40"
        >
          Ver más antiguas
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      <div className="grid gap-4">
        {items.map((track) => (
          <article key={`${track.id}-${track.playedAt}`} className="border rounded-2xl p-4 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0">
              {track.image ? (
                <img
                  src={track.image}
                  alt={track.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold truncate">{track.name}</h2>
              <p className="text-sm opacity-80 truncate">{track.artists}</p>
              <p className="text-sm opacity-60 truncate">{track.album}</p>
              <p className="text-xs opacity-50 mt-1">{formatDate(track.playedAt)}</p>
            </div>

            {track.spotifyUrl ? (
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline"
              >
                Abrir
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}