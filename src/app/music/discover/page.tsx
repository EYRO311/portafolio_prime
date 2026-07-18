"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MusicPageShell from "@/src/app/components/music/MusicPageShell";
import TrackRowCard from "@/src/app/components/music/TrackRowCard";
import RetroPanel from "@/src/app/components/music/RetroPanel";
import { RETRO, retroMono } from "@/src/app/components/music/retroTheme";

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

function DiscoverContent() {
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
    <MusicPageShell title="Discover" description="Recomendaciones a partir de tus canciones y artistas.">
      {loading && <p style={{ color: RETRO.textSubtle }}>Cargando descubrimiento...</p>}
      {error && <p style={{ color: RETRO.error }}>{error}</p>}

      {!loading && data?.fallback ? (
        <RetroPanel title="FALLBACK" accent={RETRO.yellow} className={`${retroMono.className} mb-6`}>
          <p style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
            Recommendations nativo no está habilitado para esta app.
            Mostrando fallback por artista
            {data.artistName ? `: ${data.artistName}` : ""}.
          </p>
        </RetroPanel>
      ) : null}

      <div className="grid gap-4">
        {data?.tracks?.map((track) => (
          <TrackRowCard
            key={track.id}
            title={track.name}
            subtitle={track.artists}
            meta={track.album}
            image={track.image}
            spotifyUrl={track.spotifyUrl}
          />
        ))}
      </div>
    </MusicPageShell>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <MusicPageShell title="Discover">
          <p style={{ color: RETRO.textSubtle }}>Cargando...</p>
        </MusicPageShell>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
