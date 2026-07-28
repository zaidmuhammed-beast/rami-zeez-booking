type StepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function Stepper({ value, min = 1, max = 20, onChange }: StepperProps) {
  return (
    <div className="inline-flex items-center gap-4 glass rounded-full px-2 py-2">
      <button
        type="button"
        aria-label="Decrease participants"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-10 w-10 rounded-full bg-white/10 text-lg font-bold disabled:opacity-30 transition hover:bg-white/20 active:scale-90"
      >
        ➖
      </button>
      <span className="w-8 text-center text-xl font-bold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase participants"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-10 w-10 rounded-full bg-white/10 text-lg font-bold disabled:opacity-30 transition hover:bg-white/20 active:scale-90"
      >
        ➕
      </button>
    </div>
  );
}
