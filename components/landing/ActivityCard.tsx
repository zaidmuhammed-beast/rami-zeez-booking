import { GlassCard } from "@/components/ui/GlassCard";

type ActivityCardProps = {
  emoji: string;
  title: string;
  description: string;
  /** Full Tailwind gradient classes, e.g. "from-hue-pink to-hue-coral". */
  accent: string;
};

export function ActivityCard({
  emoji,
  title,
  description,
  accent,
}: ActivityCardProps) {
  return (
    <GlassCard className="relative overflow-hidden p-6 flex flex-col items-start gap-3 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.14]">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <span
        className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-2xl shadow-lg shadow-purple-950/40`}
      >
        {emoji}
      </span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="text-sm text-rz-cream/75 leading-relaxed">{description}</p>
    </GlassCard>
  );
}
