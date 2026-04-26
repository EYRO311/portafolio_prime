import { NextResponse } from "next/server";
import { spotifyGet } from "@/src/app/components/lib/spotify-server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;

    const [artistRes, albumsRes] = await Promise.all([
      spotifyGet(`/artists/${artistId}`),
      spotifyGet(`/artists/${artistId}/albums?include_groups=album,single&market=MX&limit=10`),
    ]);

    if (!artistRes.ok) {
      return NextResponse.json(
        { error: "Error consultando artista", details: artistRes.data },
        { status: artistRes.status }
      );
    }

    if (!albumsRes.ok) {
      return NextResponse.json(
        { error: "Error consultando albums", details: albumsRes.data },
        { status: albumsRes.status }
      );
    }

    const artist = artistRes.data;

    return NextResponse.json({
      artist: {
        id: artist?.id ?? "",
        name: artist?.name ?? "",
        image: artist?.images?.[0]?.url ?? null,
        spotifyUrl: artist?.external_urls?.spotify ?? null,
        followers: artist?.followers?.total ?? 0,
        genres: Array.isArray(artist?.genres) ? artist.genres : [],
        popularity: artist?.popularity ?? null,
      },
      releases: Array.isArray(albumsRes.data?.items)
        ? albumsRes.data.items.map((album: any) => ({
            id: album?.id ?? "",
            name: album?.name ?? "",
            image: album?.images?.[0]?.url ?? null,
            releaseDate: album?.release_date ?? null,
            totalTracks: album?.total_tracks ?? 0,
            albumType: album?.album_type ?? null,
            spotifyUrl: album?.external_urls?.spotify ?? null,
          }))
        : [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error interno en artist detail",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}