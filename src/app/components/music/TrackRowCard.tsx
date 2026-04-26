import Cover from "./cover";

type TrackRowCardProps = {
  title: string;
  subtitle: string;
  meta?: string;
  image: string | null;
  spotifyUrl?: string | null;
  rightContent?: React.ReactNode;
  secondaryAction?: React.ReactNode;
};

export default function TrackRowCard({
  title,
  subtitle,
  meta,
  image,
  spotifyUrl,
  rightContent,
  secondaryAction,
}: TrackRowCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-white/10 p-4">
      <Cover src={image} alt={title} className="h-16 w-16" />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold">{title}</h2>
        <p className="truncate text-sm opacity-80">{subtitle}</p>
        {meta ? <p className="truncate text-sm opacity-60">{meta}</p> : null}
      </div>

      <div className="flex flex-col items-end gap-2 text-sm">
        {rightContent}
        {spotifyUrl ? (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Abrir
          </a>
        ) : null}
        {secondaryAction}
      </div>
    </article>
  );
}