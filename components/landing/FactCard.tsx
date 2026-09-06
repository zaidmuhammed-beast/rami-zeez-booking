import { GlassCard } from "@/components/ui/GlassCard";

type FactCardProps = {
  emoji: string;
  label: string;
  value: string;
  note?: string;
};

export function FactCard({ emoji, label, value, note }: FactCardProps) {
  return (
    <GlassCard className="p-5 flex items-start gap-3">
      <span className="text-2xl leading-none">{emoji}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-rz-cream/55">{label}</p>
        <p className="font-display font-bold leading-snug">{value}</p>
        {note && <p className="text-xs text-rz-cream/55 mt-0.5">{note}</p>}
      </div>
    </GlassCard>
  );
}
