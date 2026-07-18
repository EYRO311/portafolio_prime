"use client";

import { useEffect, useState } from "react";
import MusicPageShell from "@/src/app/components/music/MusicPageShell";
import TimeRangeTabs from "@/src/app/components/music/TimeRangeTabs";
import PaginationControls from "@/src/app/components/music/PaginationControls";
import Cover from "@/src/app/components/music/cover";
import ReceiptGenerator from "@/src/app/components/music/ReceiptGenerator";
import { RETRO } from "@/src/app/components/music/retroTheme";

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
      {loading && <p style={{ color: RETRO.textSubtle }}>Cargando...</p>}
      {error && (
        <p className="mb-6" style={{ color: RETRO.error }}>
          {error}
        </p>
      )}
      {!loading && !error && tracks.length === 0 && (
        <p style={{ color: RETRO.textSubtle }}>No se encontraron tracks para este rango.</p>
      )}

      <div className="mb-6">
        <ReceiptGenerator apiPath="/auth/spotify/top-tracks" />
      </div>

      <div className="grid gap-3">
        {tracks.map((track, index) => (
          <article
            key={track.id}
            className="flex items-center gap-4 rounded-lg p-4"
            style={{ border: `1px solid ${RETRO.border}`, background: RETRO.panelAlt }}
          >
            <Cover src={track.image} alt={track.name} className="h-14 w-14" />

            <div className="min-w-0 flex-1">
              <p style={{ fontSize: "0.85rem", color: RETRO.textMuted }}>
                #{offset + index + 1}
              </p>
              <h4 className="truncate font-semibold" style={{ color: RETRO.text }}>
                {track.name}
              </h4>
              <p className="truncate" style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                {track.artists}
              </p>
              <p className="truncate" style={{ fontSize: "0.9rem", color: RETRO.textMuted }}>
                {track.album}
              </p>
            </div>

            <div className="text-right shrink-0" style={{ fontSize: "0.95rem", color: RETRO.textSubtle }}>
              <p>{formatDuration(track.durationMs)}</p>
              {track.spotifyUrl && (
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: RETRO.cyan }}
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
