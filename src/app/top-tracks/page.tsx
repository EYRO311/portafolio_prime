"use client";

import { useEffect, useState } from "react";
import MusicPageShell from "@/src/app/components/music/MusicPageShell";
import TimeRangeTabs from "@/src/app/components/music/TimeRangeTabs";
import PaginationControls from "@/src/app/components/music/PaginationControls";
import TrackRowCard from "@/src/app/components/music/TrackRowCard";

type TimeRange = "short_term" | "medium_term" | "long_term";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
  recentListenCount: number;
};

type ApiResponse = {
  tracks: Track[];
  meta: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
    timeRange: TimeRange;
  };
};

export default function TopTracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [meta, setMeta] = useState<ApiResponse["meta"] | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/auth/spotify/top-tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "No se pudieron cargar las canciones");
        }

        setTracks(data.tracks || []);
        setMeta(data.meta || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [timeRange, offset]);

  return (
    <MusicPageShell
      title="Tus top tracks"
      description="El conteo mostrado es solo del historial reciente cargado, no histórico total."
      actions={
        <TimeRangeTabs
          value={timeRange}
          onChange={(value) => {
            setTimeRange(value);
            setOffset(0);
          }}
        />
      }
    >
      {loading && <p>Cargando...</p>}

      <div className="grid gap-4">
        {tracks.map((track, index) => (
          <TrackRowCard
            key={track.id}
            title={`#${offset + index + 1} · ${track.name}`}
            subtitle={track.artists}
            meta={`${track.album} · Escuchas en historial reciente: ${track.recentListenCount}`}
            image={track.image}
            spotifyUrl={track.spotifyUrl}
            secondaryAction={
              <a
                href={`/music/discover?seed_track=${track.id}`}
                className="underline"
              >
                Ver recomendaciones
              </a>
            }
          />
        ))}
      </div>

      <PaginationControls
        hasPrevious={meta?.hasPrevious}
        hasNext={meta?.hasNext}
        onPrevious={() => setOffset((prev) => Math.max(prev - limit, 0))}
        onNext={() => setOffset((prev) => prev + limit)}
        label={
          meta
            ? `${meta.offset + 1}-${Math.min(meta.offset + meta.limit, meta.total)} de ${meta.total}`
            : "—"
        }
      />
    </MusicPageShell>
  );
}