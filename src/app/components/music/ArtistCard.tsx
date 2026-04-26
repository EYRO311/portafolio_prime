import Cover from "./cover";

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
    <article className="rounded-2xl border border-white/10 p-4">
      <Cover src={image} alt={name} className="mb-4 h-48 w-full" />

      {typeof rank === "number" ? (
        <p className="text-sm opacity-60">#{rank}</p>
      ) : null}

      <h2 className="truncate text-lg font-semibold">{name}</h2>

      <p className="mt-1 text-sm opacity-70">
        {genres.slice(0, 3).join(", ") || "Sin géneros"}
      </p>

      {typeof followers === "number" ? (
        <p className="mt-1 text-sm opacity-50">{followers} followers</p>
      ) : null}

      <div className="mt-4 flex gap-3">
        {spotifyUrl ? (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline"
          >
            Abrir
          </a>
        ) : null}

        {artistId ? (
          <a
            href={`/music/discover?seed_artist=${artistId}`}
            className="text-sm underline"
          >
            Ver recomendaciones
          </a>
        ) : null}
      </div>
    </article>
  );
}