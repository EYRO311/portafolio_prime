import { cookies } from "next/headers";

const SPOTIFY_API = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

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

export async function refreshSpotifyAccessToken(refreshToken: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    throw new Error("Falta SPOTIFY_CLIENT_ID");
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
    throw new Error(data?.error_description || data?.error || "No se pudo refrescar el token");
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

export async function getSpotifyAccessToken() {
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

async function spotifyRequest(method: string, path: string, body?: object) {
  let accessToken = await getSpotifyAccessToken();

  if (!accessToken) {
    return { ok: false, status: 401, data: { error: "No autenticado" } };
  }

  const buildInit = (token: string): RequestInit => ({
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let res = await fetch(`${SPOTIFY_API}${path}`, buildInit(accessToken));
  let data = await readJson(res);

  if (res.status === 401) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

    if (!refreshToken) {
      return { ok: false, status: 401, data: { error: "Sesión expirada" } };
    }

    accessToken = await refreshSpotifyAccessToken(refreshToken);
    res = await fetch(`${SPOTIFY_API}${path}`, buildInit(accessToken));
    data = await readJson(res);
  }

  return { ok: res.ok, status: res.status, data };
}

export const spotifyGet = (path: string) => spotifyRequest("GET", path);
export const spotifyPut = (path: string, body?: object) => spotifyRequest("PUT", path, body);
export const spotifyPost = (path: string, body?: object) => spotifyRequest("POST", path, body);

export function mapTrack(track: any) {
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

export function mapArtist(artist: any) {
  return {
    id: artist?.id ?? crypto.randomUUID(),
    name: artist?.name ?? "Unknown artist",
    image: artist?.images?.[0]?.url ?? null,
    spotifyUrl: artist?.external_urls?.spotify ?? null,
    followers: artist?.followers?.total ?? 0,
    genres: Array.isArray(artist?.genres) ? artist.genres : [],
  };
}