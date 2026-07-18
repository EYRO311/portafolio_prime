import Cover from "./cover";
import { RETRO } from "@/src/app/components/music/retroTheme";

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
    <article
      className="flex items-center gap-4 rounded-lg p-4"
      style={{ border: `1px solid ${RETRO.border}`, background: RETRO.panelAlt }}
    >
      <Cover src={image} alt={title} className="h-16 w-16" />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold" style={{ color: RETRO.text }}>{title}</h2>
        <p className="truncate text-sm" style={{ color: RETRO.textSubtle }}>{subtitle}</p>
        {meta ? <p className="truncate text-sm" style={{ color: RETRO.textMuted }}>{meta}</p> : null}
      </div>

      <div className="flex flex-col items-end gap-2 text-sm" style={{ color: RETRO.textSubtle }}>
        {rightContent}
        {spotifyUrl ? (
          <a href={spotifyUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: RETRO.cyan }}>
            Abrir
          </a>
        ) : null}
        {secondaryAction}
      </div>
    </article>
  );
}
