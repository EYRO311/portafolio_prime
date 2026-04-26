import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SPOTIFY_API = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const DASHBOARD_TTL_MS = 15_000;

type CacheEntry = {
  expiresAt: number;
  data: any;
};

type SpotifyResult = {
  status: number;
  data: any;
};

const dashboardCache = new Map<string, CacheEntry>();
const inflightRequests = new Map<string, Promise<any>>();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

class RouteError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function readJson(res: Response) {
  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function spotifyGet(path: string, accessToken: string): Promise<SpotifyResult> {
  const res = await fetch(`${SPOTIFY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await readJson(res);

  return {
    status: res.status,
    data,
  };
}

async function refreshSpotifyAccessToken(refreshToken: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    throw new RouteError(500, "Falta SPOTIFY_CLIENT_ID");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const data = await readJson(res);

  if (!res.ok || !data?.access_token) {
    throw new RouteError(
      401,
      data?.error_description || data?.error || "No se pudo refrescar el token",
      data
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("spotify_access_token", data.access_token, {
    ...cookieOptions,
    maxAge: data.expires_in ?? 3600,
  });

  if (data.refresh_token) {
    cookieStore.set("spotify_refresh_token", data.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return data.access_token as string;
}

async function getWorkingAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (accessToken) return accessToken;
  if (!refreshToken) return null;

  try {
    return await refreshSpotifyAccessToken(refreshToken);
  } catch {
    return null;
  }
}

function mapTrack(track: any) {
  return {
    id: track?.id ?? crypto.randomUUID(),
    name: track?.name ?? "Unknown track",
    artists: Array.isArray(track?.artists)
      ? track.artists.map((artist: any) => artist.name).join(", ")
      : "",
    album: track?.album?.name ?? "",
    image: track?.album?.images?.[0]?.url ?? null,
    spotifyUrl: track?.external_urls?.spotify ?? null,
    durationMs: track?.duration_ms ?? 0,
  };
}

function mapArtist(artist: any) {
  return {
    id: artist?.id ?? crypto.randomUUID(),
    name: artist?.name ?? "Unknown artist",
    image: artist?.images?.[0]?.url ?? null,
    spotifyUrl: artist?.external_urls?.spotify ?? null,
    followers: artist?.followers?.total ?? 0,
    genres: Array.isArray(artist?.genres) ? artist.genres : [],
  };
}

function mapPlaylist(playlist: any) {
  return {
    id: playlist?.id ?? crypto.randomUUID(),
    name: playlist?.name ?? "Untitled playlist",
    image: playlist?.images?.[0]?.url ?? null,
    spotifyUrl: playlist?.external_urls?.spotify ?? null,
    owner: playlist?.owner?.display_name ?? playlist?.owner?.id ?? "Unknown",
    tracksTotal: playlist?.tracks?.total ?? 0,
    collaborative: Boolean(playlist?.collaborative),
    public: playlist?.public ?? null,
  };
}

function normalizeTimeRange(value: string | null): "short_term" | "medium_term" | "long_term" {
  if (value === "medium_term" || value === "long_term") return value;
  return "short_term";
}

function normalizeLimit(value: string | null) {
  const parsed = Number(value || "10");
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(50, Math.max(1, Math.floor(parsed)));
}

function getCacheKey(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  timeRange: string,
  limit: number
) {
  const userId = cookieStore.get("spotify_user_id")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  const identity =
    userId ||
    refreshToken?.slice(-24) ||
    accessToken?.slice(-24) ||
    null;

  if (!identity) return null;

  return `${identity}:${timeRange}:${limit}`;
}

export async function GET(request: Request) {
  let cacheKey: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const timeRange = normalizeTimeRange(searchParams.get("time_range"));
    const limit = normalizeLimit(searchParams.get("limit"));

    const cookieStore = await cookies();
    cacheKey = getCacheKey(cookieStore, timeRange, limit);

    if (cacheKey) {
      const now = Date.now();
      const cached = dashboardCache.get(cacheKey);

      if (cached && cached.expiresAt > now) {
        return NextResponse.json(cached.data);
      }

      const pending = inflightRequests.get(cacheKey);
      if (pending) {
        const data = await pending;
        return NextResponse.json(data);
      }
    }

    const buildDashboard = async () => {
      let accessToken = await getWorkingAccessToken();

      if (!accessToken) {
        throw new RouteError(401, "No autenticado");
      }

      const loadAll = async (token: string) => {
        return Promise.all([
          spotifyGet("/me", token),
          spotifyGet(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, token),
          spotifyGet(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, token),
          spotifyGet(`/me/player/recently-played?limit=${limit}`, token),
          spotifyGet("/me/player", token),
          spotifyGet(`/me/playlists?limit=${limit}`, token),
        ]);
      };

      let [profileRes, topTracksRes, topArtistsRes, recentRes, playbackRes, playlistsRes] =
        await loadAll(accessToken);

      const hasUnauthorized = [
        profileRes,
        topTracksRes,
        topArtistsRes,
        recentRes,
        playbackRes,
        playlistsRes,
      ].some((entry) => entry.status === 401);

      if (hasUnauthorized) {
        const currentCookies = await cookies();
        const refreshToken = currentCookies.get("spotify_refresh_token")?.value;

        if (!refreshToken) {
          throw new RouteError(401, "Sesión expirada");
        }

        accessToken = await refreshSpotifyAccessToken(refreshToken);

        [profileRes, topTracksRes, topArtistsRes, recentRes, playbackRes, playlistsRes] =
          await loadAll(accessToken);
      }

      if (profileRes.status === 429 || topTracksRes.status === 429 || topArtistsRes.status === 429) {
        throw new RouteError(429, "Spotify rate limit alcanzado");
      }

      if (profileRes.status >= 400 || topTracksRes.status >= 400 || topArtistsRes.status >= 400) {
        throw new RouteError(502, "No se pudo construir el dashboard", {
          profile: profileRes.data,
          topTracks: topTracksRes.data,
          topArtists: topArtistsRes.data,
        });
      }

      const profile = {
        id: profileRes.data?.id ?? "",
        name: profileRes.data?.display_name ?? profileRes.data?.id ?? "Spotify user",
        email: profileRes.data?.email ?? null,
        country: profileRes.data?.country ?? null,
        product: profileRes.data?.product ?? null,
        followers: profileRes.data?.followers?.total ?? 0,
        image: profileRes.data?.images?.[0]?.url ?? null,
      };

      const topTracks = Array.isArray(topTracksRes.data?.items)
        ? topTracksRes.data.items.map(mapTrack)
        : [];

      const topArtists = Array.isArray(topArtistsRes.data?.items)
        ? topArtistsRes.data.items.map(mapArtist)
        : [];

      const recentlyPlayed =
        recentRes.status >= 400 || !Array.isArray(recentRes.data?.items)
          ? []
          : recentRes.data.items.map((item: any) => ({
              ...mapTrack(item?.track),
              playedAt: item?.played_at ?? null,
            }));

      const playback =
        playbackRes.status === 204 || playbackRes.status >= 400 || !playbackRes.data
          ? null
          : {
              isPlaying: Boolean(playbackRes.data?.is_playing),
              progressMs: playbackRes.data?.progress_ms ?? 0,
              currentlyPlayingType: playbackRes.data?.currently_playing_type ?? null,
              device: playbackRes.data?.device
                ? {
                    name: playbackRes.data.device.name ?? "Unknown device",
                    type: playbackRes.data.device.type ?? "Unknown",
                    volumePercent: playbackRes.data.device.volume_percent ?? null,
                    isActive: Boolean(playbackRes.data.device.is_active),
                  }
                : null,
              item: playbackRes.data?.item ? mapTrack(playbackRes.data.item) : null,
            };

      const playlists =
        playlistsRes.status >= 400 || !Array.isArray(playlistsRes.data?.items)
          ? []
          : playlistsRes.data.items.map(mapPlaylist);

      return {
        profile,
        playback,
        topTracks,
        topArtists,
        recentlyPlayed,
        playlists,
        generatedAt: new Date().toISOString(),
      };
    };

    const requestPromise = buildDashboard();

    if (cacheKey) {
      inflightRequests.set(cacheKey, requestPromise);
    }

    try {
      const payload = await requestPromise;

      if (cacheKey) {
        dashboardCache.set(cacheKey, {
          data: payload,
          expiresAt: Date.now() + DASHBOARD_TTL_MS,
        });
      }

      return NextResponse.json(payload);
    } finally {
      if (cacheKey) {
        inflightRequests.delete(cacheKey);
      }
    }
  } catch (error) {
    if (cacheKey) {
      inflightRequests.delete(cacheKey);
    }

    if (error instanceof RouteError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details ?? null,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno en dashboard",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}