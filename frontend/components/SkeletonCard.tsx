export default function SkeletonCard() {
  return (
    <div className="bg-surface-mid border border-surface-border rounded-md px-[14px] py-3 flex gap-3 animate-pulse">
      <div className="shrink-0 w-11 h-11 rounded-full bg-surface-high" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-surface-high rounded w-1/3" />
          <div className="h-3 bg-surface-high rounded-sm w-8" />
        </div>
        <div className="h-2 bg-surface-border rounded w-1/4" />
        <div className="space-y-1.5 pt-1">
          <div className="h-2 bg-surface-border rounded w-full" />
          <div className="h-2 bg-surface-border rounded w-4/5" />
        </div>
        <div className="h-[2px] bg-surface-border rounded w-full mt-3" />
      </div>
    </div>
  );
}
