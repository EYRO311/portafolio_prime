import { Press_Start_2P, VT323 } from "next/font/google";

export const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const retroMono = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-retro-mono",
});

export const retroFontVars = `${pixelFont.variable} ${retroMono.variable}`;

export const RETRO = {
  bg: "#1a0b2e",
  bgGradient: "linear-gradient(180deg, #1a0b2e 0%, #2d1b4e 55%, #1a0b2e 100%)",
  panel: "#1f1033",
  panelAlt: "#241640",
  pink: "#ff2ec4",
  cyan: "#05d9e8",
  yellow: "#f9f002",
  purple: "#9d4edd",
  text: "#f5f0ff",
  textMuted: "rgba(245,240,255,0.68)",
  textSubtle: "rgba(245,240,255,0.82)",
  border: "rgba(245,240,255,0.16)",
  error: "#ff5c8a",
} as const;

export const ACCENTS = [RETRO.pink, RETRO.cyan, RETRO.yellow, RETRO.purple];

export function accentFor(index: number): string {
  return ACCENTS[index % ACCENTS.length];
}
