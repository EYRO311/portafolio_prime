"use client";

import { useCallback, useRef, useState } from "react";
import SpotifyPlayer from "@/src/app/components/music/SpotifyPlayer";
import RetroPanel from "@/src/app/components/music/RetroPanel";
import Cover from "@/src/app/components/music/cover";
import { RETRO, retroMono } from "@/src/app/components/music/retroTheme";

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

const rowStyle = {
  border: `1px solid ${RETRO.border}`,
  background: RETRO.panelAlt,
};

export default function MusicClient() {
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
      <RetroPanel title="CONNECT SPOTIFY" accent={RETRO.pink} className={retroMono.className}>
        <p className="mb-4" style={{ fontSize: "1.15rem", color: RETRO.textSubtle }}>
          Necesito permisos para leer top tracks, top artists, reproducción actual,
          historial reciente y playlists.
        </p>

        <a
          href="/auth/spotify/login"
          className="inline-flex rounded-lg px-4 py-2 font-semibold transition hover:opacity-85"
          style={{ border: `2px solid ${RETRO.cyan}`, color: RETRO.cyan, background: "transparent" }}
        >
          Conectar Spotify
        </a>
      </RetroPanel>
    );
  }

  return (
    <div className={`${retroMono.className} space-y-8`}>
      <SpotifyPlayer />

      {/* Control section */}
      <RetroPanel title="CONTROLS" accent={RETRO.yellow}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p style={{ fontSize: "1rem", color: RETRO.textMuted }}>Spotify dashboard</p>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: RETRO.text }}>
              {data?.profile.name ?? "Carga manual"}
            </h2>
            <p style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
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
                className="rounded-lg px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  border: `2px solid ${timeRange === value ? RETRO.cyan : RETRO.border}`,
                  background: timeRange === value ? "rgba(5,217,232,0.15)" : "transparent",
                  color: timeRange === value ? RETRO.cyan : RETRO.text,
                  fontSize: "0.95rem",
                }}
              >
                {timeRangeLabels[value]}
              </button>
            ))}

            <button
              onClick={loadDashboard}
              disabled={loading || refreshing}
              className="rounded-lg px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ border: `2px solid ${RETRO.pink}`, color: RETRO.pink, background: "transparent", fontSize: "0.95rem" }}
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
          <p className="mt-4" style={{ fontSize: "1rem", color: RETRO.yellow }}>
            Cambiaste el rango a <strong>{timeRangeLabels[timeRange]}</strong>, pero los
            datos en pantalla siguen mostrando{" "}
            <strong>{timeRangeLabels[loadedTimeRange as TimeRange]}</strong> hasta que
            presiones <strong>Cargar este rango</strong>.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4" style={{ fontSize: "1rem", color: RETRO.error }}>
            {error}
          </p>
        ) : null}
      </RetroPanel>

      {!hasData && !loading ? (
        <RetroPanel title="READY" accent={RETRO.purple}>
          <h3 className="mb-2" style={{ fontSize: "1.3rem", fontWeight: 700, color: RETRO.text }}>
            Listo para consultar Spotify
          </h3>
          <p style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
            Selecciona un rango y presiona <strong>Cargar dashboard</strong>.
          </p>
          {!hasTriedLoad ? (
            <p className="mt-3" style={{ fontSize: "0.95rem", color: RETRO.textMuted }}>
              No hay auto-fetch, no hay polling y no se consulta al cambiar tabs.
            </p>
          ) : null}
        </RetroPanel>
      ) : null}

      {loading && !hasData ? (
        <p style={{ color: RETRO.textSubtle, fontSize: "1.1rem" }}>Cargando dashboard de Spotify...</p>
      ) : null}

      {hasData ? (
        <>
          {/* Profile + Currently playing */}
          <section className="grid gap-6 lg:grid-cols-2">
            <RetroPanel title="PROFILE" accent={RETRO.cyan}>
              <div className="mb-4 flex items-center gap-4">
                <Cover src={data?.profile.image || null} alt={data?.profile.name || ""} className="h-16 w-16" />
                <div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: RETRO.text }}>
                    {data?.profile.name}
                  </h4>
                  <p style={{ fontSize: "0.95rem", color: RETRO.textSubtle }}>
                    {data?.profile.product ?? "Cuenta Spotify"} ·{" "}
                    {data?.profile.followers} followers
                  </p>
                </div>
              </div>

              <div className="space-y-1" style={{ fontSize: "1rem" }}>
                <p style={{ color: RETRO.text }}>
                  <span style={{ color: RETRO.textMuted }}>Email:</span>{" "}
                  {data?.profile.email ?? "No disponible"}
                </p>
                <p style={{ color: RETRO.text }}>
                  <span style={{ color: RETRO.textMuted }}>País:</span>{" "}
                  {data?.profile.country ?? "No disponible"}
                </p>
                <p style={{ color: RETRO.text }}>
                  <span style={{ color: RETRO.textMuted }}>Plan:</span>{" "}
                  {data?.profile.product ?? "No disponible"}
                </p>
              </div>
            </RetroPanel>

            <RetroPanel title="CURRENTLY PLAYING" accent={RETRO.pink}>
              {!data?.playback?.item ? (
                <div className="space-y-2" style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
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
                  <Cover src={data.playback.item.image} alt={data.playback.item.name} className="h-20 w-20" />
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: "0.9rem", color: RETRO.textMuted }}>
                      {data.playback.isPlaying ? "Reproduciendo" : "En pausa"}
                    </p>
                    <h4 className="truncate" style={{ fontSize: "1.2rem", fontWeight: 700, color: RETRO.text }}>
                      {data.playback.item.name}
                    </h4>
                    <p className="truncate" style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                      {data.playback.item.artists}
                    </p>
                    <p className="truncate" style={{ fontSize: "0.9rem", color: RETRO.textMuted }}>
                      {data.playback.item.album}
                    </p>
                    <div className="mt-3" style={{ fontSize: "0.95rem", color: RETRO.textSubtle }}>
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
                        className="mt-3 inline-flex underline"
                        style={{ color: RETRO.cyan, fontSize: "1rem" }}
                      >
                        Abrir en Spotify
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
            </RetroPanel>
          </section>

          {/* Top Artists */}
          <RetroPanel title="TOP ARTISTS" accent={RETRO.yellow}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {data?.topArtists.map((artist, index) => (
                <article key={artist.id} className="rounded-lg p-4" style={rowStyle}>
                  <Cover src={artist.image} alt={artist.name} className="mb-3 h-28 w-full" />
                  <p style={{ fontSize: "0.85rem", color: RETRO.textMuted }}>#{index + 1}</p>
                  <h4 className="truncate" style={{ fontWeight: 700, color: RETRO.text }}>
                    {artist.name}
                  </h4>
                  <p className="mt-1 truncate" style={{ fontSize: "0.85rem", color: RETRO.textSubtle }}>
                    {artist.genres.slice(0, 2).join(", ") || "Sin géneros"}
                  </p>
                  <p className="mt-1" style={{ fontSize: "0.85rem", color: RETRO.textMuted }}>
                    {artist.followers} followers
                  </p>
                  {artist.spotifyUrl ? (
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex underline"
                      style={{ color: RETRO.cyan, fontSize: "0.95rem" }}
                    >
                      Ver artista
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </RetroPanel>

          {/* Top Tracks */}
          <RetroPanel title="TOP TRACKS" accent={RETRO.purple}>
            <div className="grid gap-3">
              {data?.topTracks.map((track, index) => (
                <article key={track.id} className="flex items-center gap-4 rounded-lg p-4" style={rowStyle}>
                  <Cover src={track.image} alt={track.name} />
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: "0.85rem", color: RETRO.textMuted }}>#{index + 1}</p>
                    <h4 className="truncate" style={{ fontWeight: 700, color: RETRO.text }}>
                      {track.name}
                    </h4>
                    <p className="truncate" style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                      {track.artists}
                    </p>
                    <p className="truncate" style={{ fontSize: "0.9rem", color: RETRO.textMuted }}>
                      {track.album}
                    </p>
                  </div>
                  <div className="text-right" style={{ fontSize: "0.95rem", color: RETRO.textSubtle }}>
                    <p>{formatDuration(track.durationMs)}</p>
                    {track.spotifyUrl ? (
                      <a href={track.spotifyUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: RETRO.cyan }}>
                        Abrir
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </RetroPanel>

          {/* History + Playlists */}
          <section className="grid gap-6 lg:grid-cols-2">
            <RetroPanel title="RECENT HISTORY" accent={RETRO.cyan}>
              <div className="grid gap-3">
                {data?.recentlyPlayed.length === 0 ? (
                  <p style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                    No hay historial reciente disponible.
                  </p>
                ) : (
                  data?.recentlyPlayed.map((track) => (
                    <article key={`${track.id}-${track.playedAt}`} className="flex items-center gap-4 rounded-lg p-4" style={rowStyle}>
                      <Cover src={track.image} alt={track.name} />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate" style={{ fontWeight: 700, color: RETRO.text }}>
                          {track.name}
                        </h4>
                        <p className="truncate" style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                          {track.artists}
                        </p>
                        <p className="truncate" style={{ fontSize: "0.85rem", color: RETRO.textMuted }}>
                          {formatDate(track.playedAt)}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </RetroPanel>

            <RetroPanel title="PLAYLISTS" accent={RETRO.pink}>
              <div className="grid gap-3">
                {data?.playlists.length === 0 ? (
                  <p style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                    No hay playlists disponibles.
                  </p>
                ) : (
                  data?.playlists.map((playlist) => (
                    <article key={playlist.id} className="flex items-center gap-4 rounded-lg p-4" style={rowStyle}>
                      <Cover src={playlist.image} alt={playlist.name} />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate" style={{ fontWeight: 700, color: RETRO.text }}>
                          {playlist.name}
                        </h4>
                        <p className="truncate" style={{ fontSize: "1rem", color: RETRO.textSubtle }}>
                          {playlist.owner} · {playlist.tracksTotal} tracks
                        </p>
                        <p className="truncate" style={{ fontSize: "0.85rem", color: RETRO.textMuted }}>
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
                        <a href={playlist.spotifyUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: RETRO.cyan }}>
                          Abrir
                        </a>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </RetroPanel>
          </section>
        </>
      ) : null}
    </div>
  );
}
