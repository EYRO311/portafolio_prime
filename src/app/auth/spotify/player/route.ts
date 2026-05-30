import { NextRequest, NextResponse } from "next/server";
import { spotifyGet, spotifyPost, spotifyPut } from "@/src/app/components/lib/spotify-server";

function mapPlayback(raw: any) {
  if (!raw) return null;

  const track = raw.item ?? null;

  return {
    isPlaying: raw.is_playing ?? false,
    progressMs: raw.progress_ms ?? 0,
    currentlyPlayingType: raw.currently_playing_type ?? null,
    item: track
      ? {
          id: track.id ?? crypto.randomUUID(),
          name: track.name ?? "Unknown track",
          artists: Array.isArray(track.artists)
            ? track.artists.map((a: any) => a.name).join(", ")
            : "",
          album: track.album?.name ?? "",
          image: track.album?.images?.[0]?.url ?? null,
          spotifyUrl: track.external_urls?.spotify ?? null,
          durationMs: track.duration_ms ?? 0,
        }
      : null,
    device: raw.device
      ? {
          name: raw.device.name ?? "",
          type: raw.device.type ?? "",
          volumePercent: raw.device.volume_percent ?? null,
          isActive: raw.device.is_active ?? false,
        }
      : null,
  };
}

export async function GET() {
  const result = await spotifyGet("/me/player");

  if (result.status === 401) {
    return NextResponse.json({ error: result.data?.error ?? "No autenticado" }, { status: 401 });
  }

  if (!result.ok) {
    return NextResponse.json({ error: "No se pudo obtener el estado del reproductor" }, { status: result.status });
  }

  return NextResponse.json(mapPlayback(result.data));
}

export async function POST(req: NextRequest) {
  let body: { action?: string; positionMs?: number };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { action, positionMs } = body;

  let result: Awaited<ReturnType<typeof spotifyPut>>;

  switch (action) {
    case "play":
      result = await spotifyPut("/me/player/play");
      break;
    case "pause":
      result = await spotifyPut("/me/player/pause");
      break;
    case "next":
      result = await spotifyPost("/me/player/next");
      break;
    case "previous":
      result = await spotifyPost("/me/player/previous");
      break;
    case "seek":
      if (positionMs === undefined) {
        return NextResponse.json({ error: "positionMs requerido para seek" }, { status: 400 });
      }
      result = await spotifyPut(`/me/player/seek?position_ms=${Math.floor(positionMs)}`);
      break;
    default:
      return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
  }

  if (result.status === 403) {
    return NextResponse.json({ error: "Se requiere Spotify Premium para controlar la reproducción" }, { status: 403 });
  }

  if (result.status === 404) {
    return NextResponse.json({ error: "No hay dispositivo activo" }, { status: 404 });
  }

  if (!result.ok && result.status !== 204) {
    return NextResponse.json({ error: result.data?.error?.message ?? "Error al ejecutar la acción" }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
