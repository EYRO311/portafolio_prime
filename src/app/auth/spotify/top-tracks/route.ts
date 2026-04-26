import { NextResponse } from "next/server";
import { mapTrack, spotifyGet } from "@/src/app/components/lib/spotify-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "medium_term";
    const limit = Number(searchParams.get("limit") || "20");
    const offset = Number(searchParams.get("offset") || "0");

    const [topRes, recentRes] = await Promise.all([
      spotifyGet(`/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`),
      spotifyGet(`/me/player/recently-played?limit=50`),
    ]);

    if (!topRes.ok) {
      return NextResponse.json(
        { error: "Error consultando top tracks", details: topRes.data },
        { status: topRes.status }
      );
    }

    const topItems = Array.isArray(topRes.data?.items) ? topRes.data.items : [];
    const recentItems = Array.isArray(recentRes.data?.items) ? recentRes.data.items : [];

    const recentCountMap = new Map<string, number>();

    for (const item of recentItems) {
      const trackId = item?.track?.id;
      if (!trackId) continue;
      recentCountMap.set(trackId, (recentCountMap.get(trackId) || 0) + 1);
    }

    const tracks = topItems.map((track: any) => ({
      ...mapTrack(track),
      recentListenCount: recentCountMap.get(track.id) || 0,
    }));

    return NextResponse.json({
      tracks,
      meta: {
        limit: topRes.data?.limit ?? limit,
        offset: topRes.data?.offset ?? offset,
        total: topRes.data?.total ?? tracks.length,
        hasNext: Boolean(topRes.data?.next),
        hasPrevious: Boolean(topRes.data?.previous),
        timeRange,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error interno en top-tracks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}