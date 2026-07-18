"use client";

import { useEffect, useState } from "react";
import MusicPageShell from "@/src/app/components/music/MusicPageShell";
import TimeRangeTabs from "@/src/app/components/music/TimeRangeTabs";
import PaginationControls from "@/src/app/components/music/PaginationControls";
import ArtistCard from "@/src/app/components/music/ArtistCard";
import { RETRO } from "@/src/app/components/music/retroTheme";

type TimeRange = "short_term" | "medium_term" | "long_term";

type Artist = {
  id: string;
  name: string;
  image: string | null;
  spotifyUrl: string | null;
  followers: number;
  genres: string[];
};

type ApiResponse = {
  artists: Artist[];
  meta: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
    timeRange: TimeRange;
  };
  error?: string;
  details?: any;
};

const API_PATH = "/auth/spotify/top_artists";

export default function TopArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [meta, setMeta] = useState<ApiResponse["meta"] | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_PATH}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
          { cache: "no-store" }
        );

        const text = await res.text();
        let data: ApiResponse = { artists: [], meta: null as any };

        try {
          data = text ? JSON.parse(text) : ({} as ApiResponse);
        } catch {
          throw new Error(`Respuesta inválida del servidor: ${text || "vacía"}`);
        }

        if (!res.ok) {
          const details =
            typeof data?.details === "string"
              ? data.details
              : data?.details
              ? JSON.stringify(data.details)
              : "";

          throw new Error(
            details
              ? `${data?.error || "No se pudieron cargar los artistas"} - ${details}`
              : data?.error || "No se pudieron cargar los artistas"
          );
        }

        setArtists(data.artists || []);
        setMeta(data.meta || null);
      } catch (err) {
        setArtists([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [timeRange, offset]);

  return (
    <MusicPageShell
      title="Tus top artists"
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
      {loading && <p style={{ color: RETRO.textSubtle }}>Cargando...</p>}
      {error && <p className="mb-6" style={{ color: RETRO.error }}>{error}</p>}

      {!loading && !error && artists.length === 0 && (
        <p style={{ color: RETRO.textSubtle }}>No se encontraron artistas para este rango.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {artists.map((artist, index) => (
          <ArtistCard
            key={artist.id}
            rank={offset + index + 1}
            name={artist.name}
            image={artist.image}
            genres={artist.genres}
            followers={artist.followers}
            spotifyUrl={artist.spotifyUrl}
            artistId={artist.id}
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