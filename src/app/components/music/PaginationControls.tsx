import { RETRO } from "@/src/app/components/music/retroTheme";

type PaginationControlsProps = {
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  label?: string;
};

export default function PaginationControls({
  hasPrevious = false,
  hasNext = false,
  onPrevious,
  onNext,
  label = "—",
}: PaginationControlsProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button
        disabled={!hasPrevious}
        onClick={onPrevious}
        className="rounded-lg px-4 py-2 disabled:opacity-40"
        style={{ border: `2px solid ${RETRO.pink}`, color: RETRO.pink }}
      >
        Anterior
      </button>

      <p className="text-sm" style={{ color: RETRO.textSubtle }}>{label}</p>

      <button
        disabled={!hasNext}
        onClick={onNext}
        className="rounded-lg px-4 py-2 disabled:opacity-40"
        style={{ border: `2px solid ${RETRO.cyan}`, color: RETRO.cyan }}
      >
        Siguiente
      </button>
    </div>
  );
}
