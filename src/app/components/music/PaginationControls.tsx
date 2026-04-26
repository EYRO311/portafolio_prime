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
        className="rounded-xl border px-4 py-2 disabled:opacity-40"
      >
        Anterior
      </button>

      <p className="text-sm opacity-70">{label}</p>

      <button
        disabled={!hasNext}
        onClick={onNext}
        className="rounded-xl border px-4 py-2 disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}