import { RETRO } from "@/src/app/components/music/retroTheme";

type CoverProps = {
  src: string | null;
  alt: string;
  className?: string;
};

export default function Cover({
  src,
  alt,
  className = "h-14 w-14",
}: CoverProps) {
  if (!src) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-lg text-xs`}
        style={{ border: `2px solid ${RETRO.border}`, background: RETRO.panel, color: RETRO.textMuted }}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} shrink-0 rounded-lg object-cover`}
      style={{ border: `2px solid ${RETRO.border}` }}
    />
  );
}
