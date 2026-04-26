type TimeRange = "short_term" | "medium_term" | "long_term";

type TimeRangeTabsProps = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  disabled?: boolean;
};

const labels: Record<TimeRange, string> = {
  short_term: "4 semanas",
  medium_term: "6 meses",
  long_term: "Siempre",
};

export default function TimeRangeTabs({
  value,
  onChange,
  disabled = false,
}: TimeRangeTabsProps) {
  return (
    <>
      {(Object.keys(labels) as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          disabled={disabled}
          className={`rounded-xl border px-3 py-2 text-sm transition ${
            value === range
              ? "border-white/30 bg-white/10"
              : "border-white/10 hover:bg-white/5"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {labels[range]}
        </button>
      ))}
    </>
  );
}