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
        className={`${className} flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs opacity-60`}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} rounded-xl border border-white/10 object-cover`}
    />
  );
}