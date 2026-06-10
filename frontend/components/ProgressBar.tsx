interface Props {
  processed: number;
  total: number;
}

export default function ProgressBar({ processed, total }: Props) {
  const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-2xs text-ink-dim mb-1.5">
        <span>Processing</span>
        <span>{processed}/{total}</span>
      </div>
      <div className="w-full rounded-sm" style={{ height: 2, backgroundColor: "#e2e8f0" }}>
        <div
          className="rounded-sm transition-[width] duration-500"
          style={{ height: 2, width: `${pct}%`, backgroundColor: "#4f46e5" }}
        />
      </div>
    </div>
  );
}
