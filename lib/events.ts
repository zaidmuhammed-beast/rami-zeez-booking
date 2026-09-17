import { EVENT, PRICING } from "./constants";

export type EventStatus = "booking_open" | "announced" | "sold_out";

export type SiteEvent = {
  slug: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  /** ISO date (YYYY-MM-DD). Sorts the list and decides upcoming vs. past. */
  date: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  priceLabel: string;
  activities: string[];
  status: EventStatus;
  /** Full Tailwind gradient classes, e.g. "from-hue-pink to-hue-coral". */
  accent: string;
  bookHref?: string;
  /** Show the live remaining-slots bar on this event's card. */
  showSlots?: boolean;
};

// Add future events here — the page picks up date order, upcoming vs. past,
// and the status badge on its own.
export const EVENTS: SiteEvent[] = [
  {
    slug: "hue-and-you-1",
    emoji: "🎨",
    name: EVENT.name,
    tagline: EVENT.tagline,
    description:
      "One evening, a room full of canvases, live music and strangers who don't stay strangers. Paint something, play something, leave with people worth texting.",
    date: EVENT.date,
    dateLabel: EVENT.dateLabel,
    timeLabel: EVENT.timeLabel,
    locationLabel: EVENT.locationLabel,
    priceLabel: `PKR ${PRICING.single.toLocaleString(
      "en-PK"
    )} solo · PKR ${PRICING.duo.toLocaleString("en-PK")} duo`,
    activities: ["🎨 Paint", "🎸 Jam", "🎲 Games", "☕ Free coffee"],
    status: "booking_open",
    accent: "from-hue-pink via-hue-yellow to-hue-sky",
    bookHref: "/book",
    showSlots: true,
  },
];

export const STATUS_LABEL: Record<EventStatus, string> = {
  booking_open: "Booking open",
  announced: "Announced",
  sold_out: "Sold out",
};

/** Today's date in Pakistan, as YYYY-MM-DD, so the split matches the venue. */
function todayInPakistan() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Events today or later, soonest first. An event stays listed all day. */
export function upcomingEvents(): SiteEvent[] {
  const today = todayInPakistan();
  return EVENTS.filter((e) => e.date >= today).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

/** Events that have already happened, most recent first. */
export function pastEvents(): SiteEvent[] {
  const today = todayInPakistan();
  return EVENTS.filter((e) => e.date < today).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}
