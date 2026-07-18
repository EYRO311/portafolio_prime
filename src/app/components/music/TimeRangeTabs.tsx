import { RETRO } from "@/src/app/components/music/retroTheme";

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
      {(Object.keys(labels) as TimeRange[]).map((range) => {
        const active = value === range;
        return (
          <button
            key={range}
            onClick={() => onChange(range)}
            disabled={disabled}
            className="rounded-lg px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              border: `2px solid ${active ? RETRO.cyan : RETRO.border}`,
              background: active ? "rgba(5,217,232,0.15)" : "transparent",
              color: active ? RETRO.cyan : RETRO.text,
            }}
          >
            {labels[range]}
          </button>
        );
      })}
    </>
  );
}
