"use client";

import { useEffect, useState } from "react";
import MusicPageShell from "@/src/app/components/music/MusicPageShell";
import TimeRangeTabs from "@/src/app/components/music/TimeRangeTabs";
import PaginationControls from "@/src/app/components/music/PaginationControls";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

type TimeRange = "short_term" | "medium_term" | "long_term";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
  durationMs: number;
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
  error?: string;
};

const API_PATH = "/auth/spotify/top-tracks";

function formatDuration(ms?: number) {
  if (!ms) return "0:00";
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function TopTracksPage() {
  const { darkMode: dark } = useTheme();
  const [tracks, setTracks] = useState<Track[]>([]);
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
        let data: ApiResponse = { tracks: [], meta: null as any };
        try {
          data = text ? JSON.parse(text) : ({} as ApiResponse);
        } catch {
          throw new Error(`Respuesta inválida: ${text || "vacía"}`);
        }
        if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los tracks");
        setTracks(data.tracks || []);
        setMeta(data.meta || null);
      } catch (err) {
        setTracks([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [timeRange, offset]);

  const card = {
    border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.09)",
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
  };
  const textMain = dark ? "#ffffff" : "#0a0a0a";
  const textMuted = dark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.50)";
  const textSubtle = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.70)";

  return (
    <MusicPageShell
      title="Tus top tracks"
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
      {loading && <p style={{ color: textSubtle }}>Cargando...</p>}
      {error && (
        <p className="mb-6" style={{ color: dark ? "#f87171" : "#dc2626" }}>
          {error}
        </p>
      )}
      {!loading && !error && tracks.length === 0 && (
        <p style={{ color: textSubtle }}>No se encontraron tracks para este rango.</p>
      )}

      <div className="grid gap-3">
        {tracks.map((track, index) => (
          <article
            key={track.id}
            className="flex items-center gap-4 rounded-2xl p-4"
            style={card}
          >
            {track.image ? (
              <img
                src={track.image}
                alt={track.name}
                className="h-14 w-14 rounded-xl object-cover shrink-0"
                style={{ border: card.border }}
              />
            ) : (
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center text-xs shrink-0"
                style={{ ...card, color: textMuted }}
              >
                No img
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs" style={{ color: textMuted }}>
                #{offset + index + 1}
              </p>
              <h4 className="truncate font-semibold" style={{ color: textMain }}>
                {track.name}
              </h4>
              <p className="truncate text-sm" style={{ color: textSubtle }}>
                {track.artists}
              </p>
              <p className="truncate text-sm" style={{ color: textMuted }}>
                {track.album}
              </p>
            </div>

            <div className="text-right text-sm shrink-0" style={{ color: textSubtle }}>
              <p>{formatDuration(track.durationMs)}</p>
              {track.spotifyUrl && (
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "#1e8bc6" }}
                >
                  Abrir
                </a>
              )}
            </div>
          </article>
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
