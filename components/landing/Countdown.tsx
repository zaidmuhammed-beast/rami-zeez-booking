"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingUntil(target: string): Remaining | null {
  const ms = new Date(target).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return null;
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
] as const;

export function Countdown({ target }: { target: string }) {
  // Rendered on the server too, so start empty and fill in after mount to
  // keep the first client paint identical to the server HTML.
  const [left, setLeft] = useState<Remaining | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    function tick() {
      const next = remainingUntil(target);
      setLeft(next);
      setStarted(next === null);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (started) {
    return (
      <p className="font-display text-xl font-bold text-hue-yellow">
        🎨 It&apos;s happening right now!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="rounded-2xl bg-white/10 border border-white/15 px-2 py-3 text-center"
        >
          <span className="block font-display text-2xl sm:text-3xl font-extrabold tabular-nums">
            {left ? String(left[unit.key]).padStart(2, "0") : "--"}
          </span>
          <span className="block text-[11px] uppercase tracking-wider text-rz-cream/60">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
