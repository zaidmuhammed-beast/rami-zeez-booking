import Link from "next/link";
import { STATUS_LABEL, STATUS_STYLE, type SiteEvent } from "@/lib/events";

type EventTileProps = {
  event: SiteEvent;
  past?: boolean;
};

export function EventTile({ event, past = false }: EventTileProps) {
  const status = past ? "completed" : event.status;

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`glass-card relative overflow-hidden p-6 flex flex-col gap-3 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.14] ${
        past ? "opacity-70" : ""
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${event.accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl">{event.emoji}</span>
        <span className={`chip text-xs ${STATUS_STYLE[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold">{event.name}</h3>
        <p className="text-sm text-rz-cream/70">{event.tagline}</p>
      </div>

      {/* A wrapped event with no recorded date just shows nothing here. */}
      {(event.dateLabel || !past) && (
        <p className="text-sm text-rz-cream/60">
          {event.dateLabel || "Dates to be announced"}
        </p>
      )}

      <span className="mt-auto pt-2 text-sm font-semibold text-hue-yellow">
        Details →
      </span>
    </Link>
  );
}
