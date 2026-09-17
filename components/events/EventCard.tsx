import Link from "next/link";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { STATUS_LABEL, type SiteEvent } from "@/lib/events";

const STATUS_STYLE: Record<SiteEvent["status"], string> = {
  booking_open: "border-hue-mint/40 text-hue-mint",
  announced: "border-hue-yellow/40 text-hue-yellow",
  sold_out: "border-white/25 text-rz-cream/60",
};

type EventCardProps = {
  event: SiteEvent;
  /** Dimmed treatment for events that have already happened. */
  past?: boolean;
  /** Slot progress bar, passed in so the card stays a server-data-free view. */
  slots?: ReactNode;
};

export function EventCard({ event, past = false, slots }: EventCardProps) {
  const facts = [
    { emoji: "📅", label: "Date", value: event.dateLabel },
    { emoji: "⏰", label: "Time", value: event.timeLabel },
    { emoji: "📍", label: "Location", value: event.locationLabel },
    { emoji: "🎟", label: "Passes", value: event.priceLabel },
  ];

  return (
    <GlassCard
      strong={!past}
      className={`relative overflow-hidden p-6 sm:p-8 ${past ? "opacity-70" : ""}`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${event.accent}`}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-3xl">{event.emoji}</span>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
            {event.name}
          </h3>
          <p className="font-display font-bold text-rz-cream/80">
            {event.tagline}
          </p>
        </div>
        <span className={`chip text-xs ${past ? STATUS_STYLE.sold_out : STATUS_STYLE[event.status]}`}>
          {past ? "Wrapped" : STATUS_LABEL[event.status]}
        </span>
      </div>

      <p className="mt-5 text-rz-cream/75 leading-relaxed max-w-2xl">
        {event.description}
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 flex items-start gap-3"
          >
            <span className="text-xl leading-none">{fact.emoji}</span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-rz-cream/55">
                {fact.label}
              </p>
              <p className="font-semibold leading-snug">{fact.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {event.activities.map((activity) => (
          <span key={activity} className="chip text-xs">
            {activity}
          </span>
        ))}
      </div>

      {slots && <div className="mt-6">{slots}</div>}

      {!past && event.bookHref && (
        <Link href={event.bookHref} className="btn-primary mt-7 w-full sm:w-auto">
          🎟 Book Your Spot
        </Link>
      )}
    </GlassCard>
  );
}
