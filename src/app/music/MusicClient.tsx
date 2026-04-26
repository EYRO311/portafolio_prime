"use client";

import { useCallback, useRef, useState } from "react";

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
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs opacity-60`}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} rounded-xl border border-white/10 object-cover`}
    />
  );
}

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
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-2 text-2xl font-semibold">Conecta tu Spotify</h2>
        <p className="mb-4 opacity-80">
          Necesito permisos para leer top tracks, top artists, reproducción actual,
          historial reciente y playlists.
        </p>

        <a
          href="/auth/spotify/login"
          className="inline-flex rounded-xl border border-white/15 px-4 py-2 font-medium transition hover:bg-white/5"
        >
          Conectar Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm opacity-60">Spotify dashboard</p>
            <h2 className="text-2xl font-semibold">
              {data?.profile.name ?? "Carga manual"}
            </h2>
            <p className="text-sm opacity-70">
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
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  timeRange === value
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 hover:bg-white/5"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {timeRangeLabels[value]}
              </button>
            ))}

            <button
              onClick={loadDashboard}
              disabled={loading || refreshing}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
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
          <p className="mt-4 text-sm text-yellow-300">
            Cambiaste el rango a <strong>{timeRangeLabels[timeRange]}</strong>, pero los
            datos en pantalla siguen mostrando{" "}
            <strong>{timeRangeLabels[loadedTimeRange as TimeRange]}</strong> hasta que
            presiones <strong>Cargar este rango</strong>.
          </p>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </section>

      {!hasData && !loading ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-2 text-xl font-semibold">Listo para consultar Spotify</h3>
          <p className="text-sm opacity-75">
            Selecciona un rango y presiona <strong>Cargar dashboard</strong>.
          </p>

          {!hasTriedLoad ? (
            <p className="mt-3 text-sm opacity-60">
              No hay auto-fetch, no hay polling y no se consulta al cambiar tabs.
            </p>
          ) : null}
        </section>
      ) : null}

      {loading && !hasData ? (
        <p className="opacity-70">Cargando dashboard de Spotify...</p>
      ) : null}

      {hasData ? (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-xl font-semibold">Perfil</h3>

              <div className="mb-4 flex items-center gap-4">
                <Cover
                  src={data?.profile.image||null}
                  alt={data?.profile.name||""}
                  className="h-16 w-16"
                />
                <div>
                  <h4 className="text-lg font-semibold">{data?.profile.name}</h4>
                  <p className="text-sm opacity-70">
                    {data?.profile.product ?? "Cuenta Spotify"} ·{" "}
                    {data?.profile.followers} followers
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="opacity-60">Email:</span>{" "}
                  {data?.profile.email ?? "No disponible"}
                </p>
                <p>
                  <span className="opacity-60">País:</span>{" "}
                  {data?.profile.country ?? "No disponible"}
                </p>
                <p>
                  <span className="opacity-60">Plan:</span>{" "}
                  {data?.profile.product ?? "No disponible"}
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-xl font-semibold">Currently playing</h3>

              {!data?.playback?.item ? (
                <div className="space-y-2 text-sm opacity-80">
                  <p>No hay reproducción activa en este momento.</p>
                  {data?.playback?.device ? (
                    <p>
                      Dispositivo detectado: {data?.playback.device.name} ·{" "}
                      {data?.playback.device.type}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="flex gap-4">
                  <Cover
                    src={data?.playback.item.image}
                    alt={data?.playback.item.name}
                    className="h-20 w-20"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm opacity-60">
                      {data?.playback.isPlaying ? "Reproduciendo" : "En pausa"}
                    </p>
                    <h4 className="truncate text-lg font-semibold">
                      {data?.playback.item.name}
                    </h4>
                    <p className="truncate text-sm opacity-80">
                      {data?.playback.item.artists}
                    </p>
                    <p className="truncate text-sm opacity-60">
                      {data?.playback.item.album}
                    </p>

                    <div className="mt-3 text-sm opacity-80">
                      <p>
                        Progreso: {formatDuration(data?.playback.progressMs)} /{" "}
                        {formatDuration(data?.playback.item.durationMs)}
                      </p>
                      <p>
                        Dispositivo: {data?.playback.device?.name ?? "No disponible"} ·{" "}
                        {data?.playback.device?.type ?? "—"}
                      </p>
                    </div>

                    {data?.playback.item.spotifyUrl ? (
                      <a
                        href={data?.playback.item.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm underline"
                      >
                        Abrir en Spotify
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
            </article>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-xl font-semibold">Top artists</h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {data?.topArtists.map((artist, index) => (
                <article key={artist.id} className="rounded-2xl border border-white/10 p-4">
                  <Cover src={artist.image} alt={artist.name} className="mb-3 h-28 w-full" />
                  <p className="text-xs opacity-50">#{index + 1}</p>
                  <h4 className="truncate font-semibold">{artist.name}</h4>
                  <p className="mt-1 text-xs opacity-70">
                    {artist.genres.slice(0, 2).join(", ") || "Sin géneros"}
                  </p>
                  <p className="mt-1 text-xs opacity-50">{artist.followers} followers</p>

                  {artist.spotifyUrl ? (
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm underline"
                    >
                      Ver artista
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-xl font-semibold">Top tracks</h3>

            <div className="grid gap-3">
              {data?.topTracks.map((track, index) => (
                <article
                  key={track.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 p-4"
                >
                  <Cover src={track.image} alt={track.name} />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs opacity-50">#{index + 1}</p>
                    <h4 className="truncate font-semibold">{track.name}</h4>
                    <p className="truncate text-sm opacity-80">{track.artists}</p>
                    <p className="truncate text-sm opacity-50">{track.album}</p>
                  </div>

                  <div className="text-right text-sm opacity-70">
                    <p>{formatDuration(track.durationMs)}</p>
                    {track.spotifyUrl ? (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Abrir
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-xl font-semibold">Historial reciente</h3>

              <div className="grid gap-3">
                {data?.recentlyPlayed.length === 0 ? (
                  <p className="text-sm opacity-70">No hay historial reciente disponible.</p>
                ) : (
                  data?.recentlyPlayed.map((track) => (
                    <article
                      key={`${track.id}-${track.playedAt}`}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 p-4"
                    >
                      <Cover src={track.image} alt={track.name} />

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold">{track.name}</h4>
                        <p className="truncate text-sm opacity-80">{track.artists}</p>
                        <p className="truncate text-xs opacity-50">
                          {formatDate(track.playedAt)}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-xl font-semibold">Playlists seguidas / creadas</h3>

              <div className="grid gap-3">
                {data?.playlists.length === 0 ? (
                  <p className="text-sm opacity-70">No hay playlists disponibles.</p>
                ) : (
                  data?.playlists.map((playlist) => (
                    <article
                      key={playlist.id}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 p-4"
                    >
                      <Cover src={playlist.image} alt={playlist.name} />

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold">{playlist.name}</h4>
                        <p className="truncate text-sm opacity-80">
                          {playlist.owner} · {playlist.tracksTotal} tracks
                        </p>
                        <p className="truncate text-xs opacity-50">
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