"use client";

import { useCallback, useRef, useState } from "react";
import { useTheme } from "@/src/app/components/utils/ThemeContext";

type TimeRange = "short_term" | "medium_term" | "long_term";

type Profile = {
  id: string;
  name: string;
  email: string | null;
  country: string | null;
  product: string | null;
  followers: number;
  image: string | null;
};

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
  durationMs: number;
  playedAt?: string | null;
};

type Artist = {
  id: string;
  name: string;
  image: string | null;
  spotifyUrl: string | null;
  followers: number;
  genres: string[];
};

type Playlist = {
  id: string;
  name: string;
  image: string | null;
  spotifyUrl: string | null;
  owner: string;
  tracksTotal: number;
  collaborative: boolean;
  public: boolean | null;
};

type Playback = {
  isPlaying: boolean;
  progressMs: number;
  currentlyPlayingType: string | null;
  device: {
    name: string;
    type: string;
    volumePercent: number | null;
    isActive: boolean;
  } | null;
  item: Track | null;
} | null;

type DashboardResponse = {
  profile: Profile;
  playback: Playback;
  topTracks: Track[];
  topArtists: Artist[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  generatedAt: string;
};

const timeRangeLabels: Record<TimeRange, string> = {
  short_term: "4 semanas",
  medium_term: "6 meses",
  long_term: "Siempre",
};

function formatDuration(ms?: number) {
  if (!ms) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function Cover({
  src,
  alt,
  className = "h-14 w-14",
  dark,
}: {
  src: string | null;
  alt: string;
  className?: string;
  dark?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-xl text-xs opacity-60`}
        style={{
          border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.10)",
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
        }}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} rounded-xl object-cover`}
      style={{
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.10)",
      }}
    />
  );
}

export default function MusicClient() {
  const { darkMode: dark } = useTheme();

  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [loadedTimeRange, setLoadedTimeRange] = useState<TimeRange | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthed, setIsAuthed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasTriedLoad, setHasTriedLoad] = useState(false);

  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // Theme-aware class helpers
  const card = {
    border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.09)",
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    color: dark ? "#ffffff" : "#0a0a0a",
  };

  const cardInner = {
    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.07)",
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
  };

  const muted = dark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.50)";
  const subtle = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.70)";

  const loadDashboard = useCallback(async () => {
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setHasTriedLoad(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const isFirstLoad = !data;

    try {
      if (isFirstLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const res = await fetch(
        `/auth/spotify/dashboard?time_range=${timeRange}&limit=10`,
        {
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const text = await res.text();
      let payload: any = {};

      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Respuesta inválida del servidor: ${text || "vacía"}`);
      }

      if (res.status === 401) {
        setIsAuthed(false);
        setData(null);
        setLoadedTimeRange(null);
        return;
      }

      if (!res.ok) {
        throw new Error(payload?.error || "No se pudo cargar el dashboard");
      }

      setIsAuthed(true);
      setData(payload);
      setLoadedTimeRange(timeRange);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      inFlightRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, [data, timeRange]);

  const hasData = Boolean(data);
  const selectedRangeChanged = Boolean(
    data && loadedTimeRange && loadedTimeRange !== timeRange
  );

  if (!isAuthed) {
    return (
      <div
        className="rounded-3xl p-6"
        style={{ ...card, border: card.border }}
      >
        <h2 className="mb-2 text-2xl font-semibold" style={{ color: card.color }}>
          Conecta tu Spotify
        </h2>
        <p className="mb-4" style={{ color: subtle }}>
          Necesito permisos para leer top tracks, top artists, reproducción actual,
          historial reciente y playlists.
        </p>

        <a
          href="/auth/spotify/login"
          className="inline-flex rounded-xl px-4 py-2 font-medium transition"
          style={{
            border: card.border,
            color: card.color,
            background: "transparent",
          }}
        >
          Conectar Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Control section */}
      <section className="rounded-3xl p-6" style={card}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm" style={{ color: muted }}>Spotify dashboard</p>
            <h2 className="text-2xl font-semibold" style={{ color: card.color }}>
              {data?.profile.name ?? "Carga manual"}
            </h2>
            <p className="text-sm" style={{ color: subtle }}>
              {hasData
                ? `Última actualización: ${formatDate(data?.generatedAt)}`
                : "No se hará ninguna solicitud hasta que presiones un botón."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(timeRangeLabels) as TimeRange[]).map((value) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                disabled={loading || refreshing}
                className="rounded-xl px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  border:
                    timeRange === value
                      ? dark
                        ? "1px solid rgba(255,255,255,0.30)"
                        : "1px solid rgba(0,0,0,0.28)"
                      : card.border,
                  background:
                    timeRange === value
                      ? dark
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(0,0,0,0.07)"
                      : "transparent",
                  color: card.color,
                }}
              >
                {timeRangeLabels[value]}
              </button>
            ))}

            <button
              onClick={loadDashboard}
              disabled={loading || refreshing}
              className="rounded-xl px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                border: card.border,
                color: card.color,
                background: "transparent",
              }}
            >
              {loading
                ? "Cargando..."
                : refreshing
                ? "Actualizando..."
                : hasData
                ? selectedRangeChanged
                  ? "Cargar este rango"
                  : "Actualizar"
                : "Cargar dashboard"}
            </button>
          </div>
        </div>

        {selectedRangeChanged ? (
          <p className="mt-4 text-sm" style={{ color: dark ? "#fcd34d" : "#b45309" }}>
            Cambiaste el rango a <strong>{timeRangeLabels[timeRange]}</strong>, pero los
            datos en pantalla siguen mostrando{" "}
            <strong>{timeRangeLabels[loadedTimeRange as TimeRange]}</strong> hasta que
            presiones <strong>Cargar este rango</strong>.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm" style={{ color: dark ? "#f87171" : "#dc2626" }}>
            {error}
          </p>
        ) : null}
      </section>

      {!hasData && !loading ? (
        <section className="rounded-3xl p-6" style={card}>
          <h3 className="mb-2 text-xl font-semibold" style={{ color: card.color }}>
            Listo para consultar Spotify
          </h3>
          <p className="text-sm" style={{ color: subtle }}>
            Selecciona un rango y presiona <strong>Cargar dashboard</strong>.
          </p>
          {!hasTriedLoad ? (
            <p className="mt-3 text-sm" style={{ color: muted }}>
              No hay auto-fetch, no hay polling y no se consulta al cambiar tabs.
            </p>
          ) : null}
        </section>
      ) : null}

      {loading && !hasData ? (
        <p style={{ color: subtle, opacity: 0.7 }}>Cargando dashboard de Spotify...</p>
      ) : null}

      {hasData ? (
        <>
          {/* Profile + Currently playing */}
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl p-6" style={card}>
              <h3 className="mb-4 text-xl font-semibold" style={{ color: card.color }}>
                Perfil
              </h3>

              <div className="mb-4 flex items-center gap-4">
                <Cover
                  src={data?.profile.image || null}
                  alt={data?.profile.name || ""}
                  className="h-16 w-16"
                  dark={dark}
                />
                <div>
                  <h4 className="text-lg font-semibold" style={{ color: card.color }}>
                    {data?.profile.name}
                  </h4>
                  <p className="text-sm" style={{ color: subtle }}>
                    {data?.profile.product ?? "Cuenta Spotify"} ·{" "}
                    {data?.profile.followers} followers
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p style={{ color: card.color }}>
                  <span style={{ color: muted }}>Email:</span>{" "}
                  {data?.profile.email ?? "No disponible"}
                </p>
                <p style={{ color: card.color }}>
                  <span style={{ color: muted }}>País:</span>{" "}
                  {data?.profile.country ?? "No disponible"}
                </p>
                <p style={{ color: card.color }}>
                  <span style={{ color: muted }}>Plan:</span>{" "}
                  {data?.profile.product ?? "No disponible"}
                </p>
              </div>
            </article>

            <article className="rounded-3xl p-6" style={card}>
              <h3 className="mb-4 text-xl font-semibold" style={{ color: card.color }}>
                Currently playing
              </h3>

              {!data?.playback?.item ? (
                <div className="space-y-2 text-sm" style={{ color: subtle }}>
                  <p>No hay reproducción activa en este momento.</p>
                  {data?.playback?.device ? (
                    <p>
                      Dispositivo detectado: {data.playback.device.name} ·{" "}
                      {data.playback.device.type}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="flex gap-4">
                  <Cover
                    src={data.playback.item.image}
                    alt={data.playback.item.name}
                    className="h-20 w-20"
                    dark={dark}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" style={{ color: muted }}>
                      {data.playback.isPlaying ? "Reproduciendo" : "En pausa"}
                    </p>
                    <h4 className="truncate text-lg font-semibold" style={{ color: card.color }}>
                      {data.playback.item.name}
                    </h4>
                    <p className="truncate text-sm" style={{ color: subtle }}>
                      {data.playback.item.artists}
                    </p>
                    <p className="truncate text-sm" style={{ color: muted }}>
                      {data.playback.item.album}
                    </p>
                    <div className="mt-3 text-sm" style={{ color: subtle }}>
                      <p>
                        Progreso: {formatDuration(data.playback.progressMs)} /{" "}
                        {formatDuration(data.playback.item.durationMs)}
                      </p>
                      <p>
                        Dispositivo: {data.playback.device?.name ?? "No disponible"} ·{" "}
                        {data.playback.device?.type ?? "—"}
                      </p>
                    </div>
                    {data.playback.item.spotifyUrl ? (
                      <a
                        href={data.playback.item.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm underline"
                        style={{ color: "#1e8bc6" }}
                      >
                        Abrir en Spotify
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
            </article>
          </section>

          {/* Top Artists */}
          <section className="rounded-3xl p-6" style={card}>
            <h3 className="mb-4 text-xl font-semibold" style={{ color: card.color }}>
              Top artists
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {data?.topArtists.map((artist, index) => (
                <article key={artist.id} className="rounded-2xl p-4" style={cardInner}>
                  <Cover
                    src={artist.image}
                    alt={artist.name}
                    className="mb-3 h-28 w-full"
                    dark={dark}
                  />
                  <p className="text-xs" style={{ color: muted }}>#{index + 1}</p>
                  <h4 className="truncate font-semibold" style={{ color: card.color }}>
                    {artist.name}
                  </h4>
                  <p className="mt-1 text-xs" style={{ color: subtle }}>
                    {artist.genres.slice(0, 2).join(", ") || "Sin géneros"}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: muted }}>
                    {artist.followers} followers
                  </p>
                  {artist.spotifyUrl ? (
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm underline"
                      style={{ color: "#1e8bc6" }}
                    >
                      Ver artista
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          {/* Top Tracks */}
          <section className="rounded-3xl p-6" style={card}>
            <h3 className="mb-4 text-xl font-semibold" style={{ color: card.color }}>
              Top tracks
            </h3>
            <div className="grid gap-3">
              {data?.topTracks.map((track, index) => (
                <article
                  key={track.id}
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={cardInner}
                >
                  <Cover src={track.image} alt={track.name} dark={dark} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs" style={{ color: muted }}>#{index + 1}</p>
                    <h4 className="truncate font-semibold" style={{ color: card.color }}>
                      {track.name}
                    </h4>
                    <p className="truncate text-sm" style={{ color: subtle }}>
                      {track.artists}
                    </p>
                    <p className="truncate text-sm" style={{ color: muted }}>
                      {track.album}
                    </p>
                  </div>
                  <div className="text-right text-sm" style={{ color: subtle }}>
                    <p>{formatDuration(track.durationMs)}</p>
                    {track.spotifyUrl ? (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                        style={{ color: "#1e8bc6" }}
                      >
                        Abrir
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* History + Playlists */}
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl p-6" style={card}>
              <h3 className="mb-4 text-xl font-semibold" style={{ color: card.color }}>
                Historial reciente
              </h3>
              <div className="grid gap-3">
                {data?.recentlyPlayed.length === 0 ? (
                  <p className="text-sm" style={{ color: subtle }}>
                    No hay historial reciente disponible.
                  </p>
                ) : (
                  data?.recentlyPlayed.map((track) => (
                    <article
                      key={`${track.id}-${track.playedAt}`}
                      className="flex items-center gap-4 rounded-2xl p-4"
                      style={cardInner}
                    >
                      <Cover src={track.image} alt={track.name} dark={dark} />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold" style={{ color: card.color }}>
                          {track.name}
                        </h4>
                        <p className="truncate text-sm" style={{ color: subtle }}>
                          {track.artists}
                        </p>
                        <p className="truncate text-xs" style={{ color: muted }}>
                          {formatDate(track.playedAt)}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-3xl p-6" style={card}>
              <h3 className="mb-4 text-xl font-semibold" style={{ color: card.color }}>
                Playlists seguidas / creadas
              </h3>
              <div className="grid gap-3">
                {data?.playlists.length === 0 ? (
                  <p className="text-sm" style={{ color: subtle }}>
                    No hay playlists disponibles.
                  </p>
                ) : (
                  data?.playlists.map((playlist) => (
                    <article
                      key={playlist.id}
                      className="flex items-center gap-4 rounded-2xl p-4"
                      style={cardInner}
                    >
                      <Cover src={playlist.image} alt={playlist.name} dark={dark} />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold" style={{ color: card.color }}>
                          {playlist.name}
                        </h4>
                        <p className="truncate text-sm" style={{ color: subtle }}>
                          {playlist.owner} · {playlist.tracksTotal} tracks
                        </p>
                        <p className="truncate text-xs" style={{ color: muted }}>
                          {playlist.collaborative
                            ? "Collaborative"
                            : playlist.public === true
                            ? "Public"
                            : playlist.public === false
                            ? "Private"
                            : "Unknown"}
                        </p>
                      </div>
                      {playlist.spotifyUrl ? (
                        <a
                          href={playlist.spotifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm underline"
                          style={{ color: "#1e8bc6" }}
                        >
                          Abrir
                        </a>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
