import { NextResponse } from "next/server";
import { mapTrack, spotifyGet } from "@/src/app/components/lib/spotify-server";

function normalizeLimit(value: string | null) {
  const parsed = Number(value || "10");
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(10, Math.max(1, Math.floor(parsed)));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seedTrack = searchParams.get("seed_track");
    const seedArtist = searchParams.get("seed_artist");
    const limit = normalizeLimit(searchParams.get("limit"));

    if (!seedTrack && !seedArtist) {
      return NextResponse.json(
        { error: "Debes enviar seed_track o seed_artist" },
        { status: 400 }
      );
    }

    // 1) Intento nativo con /recommendations
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (seedTrack) params.set("seed_tracks", seedTrack);
    if (seedArtist) params.set("seed_artists", seedArtist);

    const nativeRes = await spotifyGet(`/recommendations?${params.toString()}`);

    if (nativeRes.ok) {
      const tracks = Array.isArray(nativeRes.data?.tracks)
        ? nativeRes.data.tracks.map(mapTrack)
        : [];

      return NextResponse.json({
        supported: true,
        fallback: false,
        source: "spotify_recommendations",
        tracks,
        seeds: nativeRes.data?.seeds ?? [],
      });
    }

    // 2) Fallback: buscar por artista
    let artistName = "";
    let seedTrackId = seedTrack ?? null;

    if (seedArtist) {
      const artistRes = await spotifyGet(`/artists/${seedArtist}`);
      if (artistRes.ok) {
        artistName = artistRes.data?.name ?? "";
      }
    }

    if (!artistName && seedTrack) {
      const trackRes = await spotifyGet(`/tracks/${seedTrack}`);
      if (trackRes.ok) {
        artistName = trackRes.data?.artists?.[0]?.name ?? "";
        seedTrackId = trackRes.data?.id ?? seedTrack;
      }
    }

    if (!artistName) {
      return NextResponse.json({
        supported: false,
        fallback: true,
        source: "none",
        reason: "No se pudo resolver el artista base para el fallback",
        tracks: [],
      });
    }

    const query = encodeURIComponent(`artist:"${artistName}"`);
    const searchRes = await spotifyGet(`/search?q=${query}&type=track&limit=${limit}`);

    if (!searchRes.ok) {
      return NextResponse.json(
        {
          supported: false,
          fallback: true,
          source: "search_by_artist",
          artistName,
          reason: "Falló también el fallback por búsqueda",
          details: searchRes.data,
          tracks: [],
        },
        { status: searchRes.status }
      );
    }

    const items = Array.isArray(searchRes.data?.tracks?.items)
      ? searchRes.data.tracks.items
      : [];

    const tracks = items
      .filter((track: any) => track?.id && track.id !== seedTrackId)
      .map(mapTrack);

    return NextResponse.json({
      supported: false,
      fallback: true,
      source: "search_by_artist",
      artistName,
      tracks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error interno en recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}