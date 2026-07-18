import Cover from "./cover";
import { RETRO } from "@/src/app/components/music/retroTheme";

type ArtistCardProps = {
  rank?: number;
  name: string;
  image: string | null;
  genres?: string[];
  followers?: number;
  spotifyUrl?: string | null;
  artistId?: string;
};

export default function ArtistCard({
  rank,
  name,
  image,
  genres = [],
  followers,
  spotifyUrl,
  artistId,
}: ArtistCardProps) {
  return (
    <article
      className="rounded-lg p-4"
      style={{ border: `1px solid ${RETRO.border}`, background: RETRO.panelAlt }}
    >
      <Cover src={image} alt={name} className="mb-4 h-48 w-full" />

      {typeof rank === "number" ? (
        <p className="text-sm" style={{ color: RETRO.textMuted }}>#{rank}</p>
      ) : null}

      <h2 className="truncate text-lg font-semibold" style={{ color: RETRO.text }}>{name}</h2>

      <p className="mt-1 text-sm" style={{ color: RETRO.textSubtle }}>
        {genres.slice(0, 3).join(", ") || "Sin géneros"}
      </p>

      {typeof followers === "number" ? (
        <p className="mt-1 text-sm" style={{ color: RETRO.textMuted }}>{followers} followers</p>
      ) : null}

      <div className="mt-4 flex gap-3 text-sm">
        {spotifyUrl ? (
          <a href={spotifyUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: RETRO.cyan }}>
            Abrir
          </a>
        ) : null}

        {artistId ? (
          <a href={`/music/discover?seed_artist=${artistId}`} className="underline" style={{ color: RETRO.pink }}>
            Ver recomendaciones
          </a>
        ) : null}
      </div>
    </article>
  );
}
