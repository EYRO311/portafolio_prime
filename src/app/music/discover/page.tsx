"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
};

type ApiResponse = {
  supported: boolean;
  fallback?: boolean;
  source?: string;
  artistName?: string;
  tracks: Track[];
};

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const seedTrack = searchParams.get("seed_track");
  const seedArtist = searchParams.get("seed_artist");

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        if (seedTrack) query.set("seed_track", seedTrack);
        if (seedArtist) query.set("seed_artist", seedArtist);
        query.set("limit", "10");

        const res = await fetch(`/auth/spotify/recommendations?${query.toString()}`, {
          cache: "no-store",
        });

        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload?.error || "No se pudo cargar discover");
        }

        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [seedTrack, seedArtist]);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Discover</h1>

      {loading && <p>Cargando descubrimiento...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && data?.fallback ? (
        <div className="rounded-2xl border p-6 mb-6">
          <p className="opacity-80">
            Recommendations nativo no está habilitado para esta app.
            Mostrando fallback por artista
            {data.artistName ? `: ${data.artistName}` : ""}.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {data?.tracks?.map((track) => (
          <article key={track.id} className="border rounded-2xl p-4 flex gap-4 items-center">
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