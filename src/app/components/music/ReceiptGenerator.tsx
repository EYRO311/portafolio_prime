"use client";

import { useRef, useState } from "react";
import { RETRO, retroMono } from "@/src/app/components/music/retroTheme";

type TimeRange = "short_term" | "medium_term" | "long_term";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  spotifyUrl: string | null;
  durationMs: number;
};

const RANGE_LABELS: Record<TimeRange, string> = {
  short_term: "4 semanas",
  medium_term: "6 meses",
  long_term: "Siempre",
};

const COUNT_OPTIONS = [10, 15, 20];

const PAPER_WIDTH = 480;
const PADDING_X = 42;
const ROW_HEIGHT = 40;

// Textura real (public/receipt-paper.png): 575x1666px, recortada al borde del papel
// (sin margen transparente), borde recto arriba, dentado abajo.
const PAPER_IMG_SRC = "/receipt-paper.png";
const PAPER_IMG_NATURAL_WIDTH = 575;
const PAPER_IMG_NATURAL_HEIGHT = 1666;
const PAPER_IMG_EDGE_SLICE = 200; // px de la imagen original reservados para cada borde

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function truncateToWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(`${truncated}…`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

function drawPaperBackground(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const scale = width / PAPER_IMG_NATURAL_WIDTH;
  const edgeDrawHeight = PAPER_IMG_EDGE_SLICE * scale;
  const middleDrawHeight = Math.max(height - edgeDrawHeight * 2, 0);
  const middleSrcHeight = PAPER_IMG_NATURAL_HEIGHT - PAPER_IMG_EDGE_SLICE * 2;

  // Borde superior (recto)
  ctx.drawImage(img, 0, 0, PAPER_IMG_NATURAL_WIDTH, PAPER_IMG_EDGE_SLICE, 0, 0, width, edgeDrawHeight);
  // Centro (estirado verticalmente segun la cantidad de tracks)
  ctx.drawImage(
    img,
    0, PAPER_IMG_EDGE_SLICE, PAPER_IMG_NATURAL_WIDTH, middleSrcHeight,
    0, edgeDrawHeight, width, middleDrawHeight
  );
  // Borde inferior (dentado)
  ctx.drawImage(
    img,
    0, PAPER_IMG_NATURAL_HEIGHT - PAPER_IMG_EDGE_SLICE, PAPER_IMG_NATURAL_WIDTH, PAPER_IMG_EDGE_SLICE,
    0, height - edgeDrawHeight, width, edgeDrawHeight
  );
}

function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  let cursor = x;
  const end = x + width;
  while (cursor < end) {
    const barWidth = 1 + Math.random() * 3.2;
    if (Math.random() > 0.42) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(cursor, y, barWidth, height);
    }
    cursor += barWidth + 1;
  }
}

async function drawReceipt(tracks: Track[], rangeLabel: string): Promise<HTMLCanvasElement> {
  const headerHeight = 118;
  const footerHeight = 118;
  const rowsHeight = tracks.length * ROW_HEIGHT;
  const height = headerHeight + rowsHeight + footerHeight;

  const paperImg = await loadImage(PAPER_IMG_SRC);

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = PAPER_WIDTH * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  drawPaperBackground(ctx, paperImg, PAPER_WIDTH, height);

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";

  ctx.font = "bold 24px 'Courier New', monospace";
  ctx.fillText("★ MY TOP TRACKS ★", PAPER_WIDTH / 2, 42);

  ctx.font = "14px 'Courier New', monospace";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(`RANGO: ${rangeLabel.toUpperCase()}`, PAPER_WIDTH / 2, 66);
  ctx.fillText(new Date().toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" }), PAPER_WIDTH / 2, 84);

  ctx.strokeStyle = "#2a2a2a";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(PADDING_X, headerHeight - 10);
  ctx.lineTo(PAPER_WIDTH - PADDING_X, headerHeight - 10);
  ctx.stroke();

  // Track rows
  ctx.textAlign = "left";
  let y = headerHeight + 20;
  tracks.forEach((track, index) => {
    const rankText = `${String(index + 1).padStart(2, "0")}.`;
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(rankText, PADDING_X, y);

    const nameX = PADDING_X + 34;
    const maxNameWidth = PAPER_WIDTH - PADDING_X - nameX;
    ctx.font = "14px 'Courier New', monospace";
    ctx.fillText(truncateToWidth(ctx, track.name, maxNameWidth), nameX, y);

    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = "#2a2a2a";
    ctx.fillText(truncateToWidth(ctx, track.artists, maxNameWidth), nameX, y + 16);

    y += ROW_HEIGHT;
  });

  const barcodeSectionY = headerHeight + rowsHeight + 8;
  ctx.strokeStyle = "#2a2a2a";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(PADDING_X, barcodeSectionY);
  ctx.lineTo(PAPER_WIDTH - PADDING_X, barcodeSectionY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "center";
  ctx.font = "12px 'Courier New', monospace";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(`${tracks.length} TRACKS · EYRO.MUSIC`, PAPER_WIDTH / 2, barcodeSectionY + 24);

  drawBarcode(ctx, PADDING_X, barcodeSectionY + 38, PAPER_WIDTH - PADDING_X * 2, 44);

  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = "#111111";
  ctx.fillText(
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(""),
    PAPER_WIDTH / 2,
    barcodeSectionY + 96
  );

  return canvas;
}

const selectStyle = {
  border: `2px solid ${RETRO.border}`,
  background: RETRO.panelAlt,
  color: RETRO.text,
};

export default function ReceiptGenerator({ apiPath }: { apiPath: string }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(10);
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setPreviewUrl(null);

    try {
      const res = await fetch(`${apiPath}?time_range=${timeRange}&limit=${count}&offset=0`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los tracks");

      const tracks: Track[] = data.tracks || [];
      if (tracks.length === 0) throw new Error("No hay tracks para este rango.");

      const canvas = await drawReceipt(tracks, RANGE_LABELS[timeRange]);
      previewRef.current = canvas;
      setPreviewUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!previewRef.current) return;
    const link = document.createElement("a");
    link.download = `top-tracks-${timeRange}-${count}.png`;
    link.href = previewRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={retroMono.className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg px-4 py-2 text-sm font-semibold transition"
        style={{ border: `2px solid ${RETRO.yellow}`, color: RETRO.yellow, background: "transparent" }}
      >
        🧾 Generar recibo
      </button>

      {open && (
        <div
          className="mt-3 rounded-lg p-4"
          style={{ border: `2px solid ${RETRO.yellow}`, background: RETRO.panel, maxWidth: 420 }}
        >
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex flex-col gap-1" style={{ fontSize: "0.9rem", color: RETRO.textSubtle }}>
              Cantidad
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="rounded-lg px-2 py-1.5"
                style={selectStyle}
              >
                {COUNT_OPTIONS.map((n) => (
                  <option key={n} value={n}>Top {n}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1" style={{ fontSize: "0.9rem", color: RETRO.textSubtle }}>
              Rango
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="rounded-lg px-2 py-1.5"
                style={selectStyle}
              >
                {(Object.keys(RANGE_LABELS) as TimeRange[]).map((range) => (
                  <option key={range} value={range}>{RANGE_LABELS[range]}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
            style={{ border: `2px solid ${RETRO.pink}`, color: RETRO.pink, background: "transparent" }}
          >
            {loading ? "Generando..." : "Generar imagen"}
          </button>

          {error && (
            <p className="mt-3" style={{ fontSize: "0.9rem", color: RETRO.error }}>{error}</p>
          )}

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Recibo de top tracks"
                className="mx-auto rounded shadow-lg"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <button
                type="button"
                onClick={download}
                className="mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold transition"
                style={{ border: `2px solid ${RETRO.cyan}`, color: RETRO.cyan, background: "transparent" }}
              >
                ⬇ Descargar imagen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
