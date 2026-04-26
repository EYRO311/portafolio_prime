import { NextResponse } from "next/server";
import { mapArtist, spotifyGet } from "@/src/app/components/lib/spotify-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "medium_term";
    const limit = Number(searchParams.get("limit") || "20");
    const offset = Number(searchParams.get("offset") || "0");

    const res = await spotifyGet(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error consultando top artists", details: res.data },
        { status: res.status }
      );
    }

    const items = Array.isArray(res.data?.items) ? res.data.items : [];

    return NextResponse.json({
      artists: items.map(mapArtist),
      meta: {
        limit: res.data?.limit ?? limit,
        offset: res.data?.offset ?? offset,
        total: res.data?.total ?? items.length,
        hasNext: Boolean(res.data?.next),
        hasPrevious: Boolean(res.data?.previous),
        timeRange,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error interno en top-artists",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}