import { GlassCard } from "@/components/ui/GlassCard";

type HighlightCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export function HighlightCard({ emoji, title, description }: HighlightCardProps) {
  return (
    <GlassCard className="p-6 flex flex-col items-start gap-3 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.14]">
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="text-sm text-rz-cream/75 leading-relaxed">{description}</p>
    </GlassCard>
  );
}
