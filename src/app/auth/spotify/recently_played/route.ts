import { NextResponse } from "next/server";
import { mapTrack, spotifyGet } from "@/src/app/components/lib/spotify-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "50");
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    const params = new URLSearchParams();
    params.set("limit", String(limit));

    if (after) params.set("after", after);
    if (before) params.set("before", before);

    const res = await spotifyGet(`/me/player/recently-played?${params.toString()}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error consultando recently played", details: res.data },
        { status: res.status }
      );
    }

    const items = Array.isArray(res.data?.items) ? res.data.items : [];

    return NextResponse.json({
      items: items.map((item: any) => ({
        ...mapTrack(item?.track),
        playedAt: item?.played_at ?? null,
      })),
      cursors: res.data?.cursors ?? null,
      next: res.data?.next ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error interno en recently-played",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}