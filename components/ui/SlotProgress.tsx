type SlotProgressProps = {
  taken: number;
  total: number;
};

export function SlotProgress({ taken, total }: SlotProgressProps) {
  const remaining = Math.max(0, total - taken);
  const pct = Math.min(100, Math.round((taken / total) * 100));
  const almostFull = remaining <= 10;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-rz-cream/80">Remaining Slots</span>
        <span className="font-semibold">
          {remaining} / {total}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden border border-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rz-amber-400 to-rz-amber-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {almostFull && (
        <p className="mt-2 text-xs font-semibold text-rz-amber-400">
          🔥 Almost Full — book before it&apos;s gone!
        </p>
      )}
    </div>
  );
}
