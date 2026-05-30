"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

type TrackInfo = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
  durationMs: number;
};

type PlaybackState = {
  isPlaying: boolean;
  progressMs: number;
  item: TrackInfo | null;
  device: { name: string; type: string; volumePercent: number | null } | null;
};

type PlayerStatus = PlaybackState | "loading" | "idle" | "unauthenticated" | "error";

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const POLL_INTERVAL = 5000;
const TICK_INTERVAL = 1000;

export default function SpotifyPlayer() {
  const { darkMode: dark } = useTheme();
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [cmdError, setCmdError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  const progressRef = useRef(0);
  const isPlayingRef = useRef(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const card = {
    border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.09)",
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    color: dark ? "#ffffff" : "#0a0a0a",
  };
  const muted = dark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.42)";
  const subtle = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.68)";
  const btnBg = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const btnBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/auth/spotify/player", { cache: "no-store" });

      if (res.status === 401) {
        setStatus("unauthenticated");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const data = await res.json();

      if (!data) {
        setStatus("idle");
        return;
      }

      const ps: PlaybackState = {
        isPlaying: data.isPlaying ?? false,
        progressMs: data.progressMs ?? 0,
        item: data.item ?? null,
        device: data.device ?? null,
      };

      progressRef.current = ps.progressMs;
      isPlayingRef.current = ps.isPlaying;
      setDisplayProgress(ps.progressMs);
      setStatus(ps);
    } catch {
      setStatus("error");
    }
  }, []);

  // Start/stop 1-second progress tick based on isPlaying
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);

    const ps = typeof status === "object" && status !== null ? (status as PlaybackState) : null;
    if (ps?.isPlaying) {
      tickRef.current = setInterval(() => {
        progressRef.current = Math.min(progressRef.current + TICK_INTERVAL, ps.item?.durationMs ?? Infinity);
        setDisplayProgress(progressRef.current);
      }, TICK_INTERVAL);
    }

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [status]);

  // Initial fetch + polling
  useEffect(() => {
    fetchState();
    pollRef.current = setInterval(fetchState, POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchState]);

  const sendAction = async (action: string, positionMs?: number) => {
    setCmdError(null);
    setActionPending(true);
    try {
      const res = await fetch("/auth/spotify/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(positionMs !== undefined ? { positionMs } : {}) }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setCmdError(payload.error ?? "Error al ejecutar la acción");
        return;
      }

      // Give Spotify a moment to update, then refresh state
      await new Promise(r => setTimeout(r, 350));
      await fetchState();
    } finally {
      setActionPending(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const ps = status as PlaybackState;
    if (!ps?.item?.durationMs) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    sendAction("seek", Math.floor(pct * ps.item.durationMs));
  };

  // Don't render if unauthenticated or errored — parent handles those states
  if (status === "unauthenticated" || status === "error") return null;

  if (status === "loading") {
    return (
      <div className="rounded-3xl p-5" style={card}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: muted }}>
          Now playing
        </p>
        <p className="text-sm" style={{ color: muted }}>Conectando...</p>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="rounded-3xl p-5" style={card}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: muted }}>
          Now playing
        </p>
        <p className="text-sm" style={{ color: subtle }}>Sin reproducción activa en este momento.</p>
      </div>
    );
  }

  const ps = status as PlaybackState;
  const duration = ps.item?.durationMs ?? 0;
  const pct = duration > 0 ? Math.min((displayProgress / duration) * 100, 100) : 0;

  return (
    <div className="rounded-3xl p-5" style={card}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: muted }}>
          Now playing
        </p>
        {ps.device && (
          <span className="text-xs truncate max-w-[180px]" style={{ color: muted }}>
            {ps.device.name} · {ps.device.type}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Album art */}
        {ps.item?.image ? (
          <img
            src={ps.item.image}
            alt={ps.item.name}
            className="h-20 w-20 rounded-2xl object-cover flex-shrink-0"
            style={{ border: `1px solid ${btnBorder}` }}
          />
        ) : (
          <div
            className="h-20 w-20 rounded-2xl flex-shrink-0 flex items-center justify-center"
            style={{ border: `1px solid ${btnBorder}`, background: btnBg, color: muted, fontSize: 28 }}
          >
            ♪
          </div>
        )}

        {/* Track info + controls */}
        <div className="flex-1 min-w-0">
          {ps.item ? (
            <>
              <h4 className="truncate font-semibold text-base leading-tight" style={{ color: card.color }}>
                {ps.item.name}
              </h4>
              <p className="truncate text-sm mt-0.5" style={{ color: subtle }}>
                {ps.item.artists}
              </p>
              <p className="truncate text-xs mt-0.5" style={{ color: muted }}>
                {ps.item.album}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: subtle }}>Sin información de pista</p>
          )}

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs tabular-nums w-8 text-right" style={{ color: muted }}>
              {formatMs(displayProgress)}
            </span>
            <div
              className="relative flex-1 h-1.5 rounded-full cursor-pointer group"
              style={{ background: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)" }}
              onClick={handleProgressClick}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${pct}%`, background: "#1DB954", transition: "width 0.3s linear" }}
              />
            </div>
            <span className="text-xs tabular-nums w-8" style={{ color: muted }}>
              {formatMs(duration)}
            </span>
          </div>

          {/* Playback controls */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => sendAction("previous")}
              disabled={actionPending}
              className="flex items-center justify-center rounded-xl w-8 h-8 text-base transition disabled:opacity-40"
              style={{ border: `1px solid ${btnBorder}`, background: btnBg, color: card.color }}
              title="Anterior"
            >
              ⏮
            </button>

            <button
              onClick={() => sendAction(ps.isPlaying ? "pause" : "play")}
              disabled={actionPending}
              className="flex items-center justify-center rounded-xl w-10 h-10 text-lg transition disabled:opacity-40"
              style={{ border: `1px solid ${btnBorder}`, background: btnBg, color: card.color }}
              title={ps.isPlaying ? "Pausar" : "Reproducir"}
            >
              {ps.isPlaying ? "⏸" : "▶"}
            </button>

            <button
              onClick={() => sendAction("next")}
              disabled={actionPending}
              className="flex items-center justify-center rounded-xl w-8 h-8 text-base transition disabled:opacity-40"
              style={{ border: `1px solid ${btnBorder}`, background: btnBg, color: card.color }}
              title="Siguiente"
            >
              ⏭
            </button>

            {ps.item?.spotifyUrl && (
              <a
                href={ps.item.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-xs underline"
                style={{ color: "#1DB954" }}
              >
                Abrir en Spotify ↗
              </a>
            )}
          </div>

          {cmdError && (
            <p className="mt-2 text-xs" style={{ color: dark ? "#f87171" : "#dc2626" }}>
              {cmdError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
