import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatPkr } from "@/lib/format";

type TicketCardProps = {
  emoji: string;
  name: string;
  seats: string;
  price: number;
  perks: string[];
  note?: string;
  highlight?: boolean;
  /** Full Tailwind gradient classes, e.g. "from-hue-pink to-hue-coral". */
  accent: string;
};

export function TicketCard({
  emoji,
  name,
  seats,
  price,
  perks,
  note,
  highlight = false,
  accent,
}: TicketCardProps) {
  return (
    <GlassCard
      strong={highlight}
      className={`relative overflow-hidden p-7 flex flex-col ${
        highlight ? "ring-1 ring-hue-yellow/50" : ""
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`}
      />
      {highlight && (
        <span className="absolute top-5 right-5 chip border-hue-yellow/40 text-hue-yellow text-xs">
          Best value
        </span>
      )}

      <span className="text-3xl">{emoji}</span>
      <h3 className="font-display text-xl font-bold mt-3">{name}</h3>
      <p className="text-sm text-rz-cream/60">{seats}</p>

      <p className="font-display text-4xl font-extrabold mt-5">
        {formatPkr(price)}
      </p>
      {note && <p className="text-xs text-rz-cream/55 mt-1">{note}</p>}

      <ul className="mt-5 space-y-2 text-sm text-rz-cream/80 flex-1">
        {perks.map((perk) => (
          <li key={perk} className="flex gap-2">
            <span aria-hidden className="text-hue-mint">
              ✓
            </span>
            {perk}
          </li>
        ))}
      </ul>

      <Link
        href="/book"
        className={highlight ? "btn-primary mt-7" : "btn-ghost mt-7"}
      >
        Book {name}
      </Link>
    </GlassCard>
  );
}
