import { EVENT, PRICING } from "./constants";

export type EventStatus = "completed" | "booking_open" | "announced";

export type EventPhoto = {
  /** Path under /public, e.g. "/images/events/couple-quiz/jam.jpg". */
  src: string;
  alt: string;
};

export type SiteEvent = {
  slug: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  /** ISO date (YYYY-MM-DD) when it's locked in. Undated events sort last. */
  date?: string;
  /** Fact rows are only rendered for the details that are actually known. */
  dateLabel?: string;
  timeLabel?: string;
  locationLabel?: string;
  priceLabel?: string;
  activities?: string[];
  status: EventStatus;
  /** Full Tailwind gradient classes, e.g. "from-hue-pink to-hue-coral". */
  accent: string;
  bookHref?: string;
  /** Show the live remaining-slots bar on this event's card. */
  showSlots?: boolean;
  /** Detail page shows a placeholder until the line-up is confirmed. */
  detailsComingSoon?: boolean;
  /** Recap photos, shown as a grid on the detail page. */
  gallery?: EventPhoto[];
};

// The whole roster lives here — adding an event is a new entry, and the
// listing sorts it, badges it and gives it a detail page automatically.
export const EVENTS: SiteEvent[] = [
  {
    slug: "couple-quiz-x-jam",
    emoji: "🎤",
    name: "Couple Quiz X Jam",
    tagline: "Quiz night meets open mic",
    description:
      "Couples went head to head on stage, the mic stayed open all evening, and nobody left without a coffee and a few new numbers.",
    date: "2026-08-23",
    dateLabel: "23rd August 2026",
    timeLabel: "4:00 PM – 7:00 PM",
    locationLabel: "SALT Cafe",
    activities: ["❤️ Couple Quiz", "🎤 Open Mic", "🎸 Live Jam", "☕ Free coffee"],
    status: "completed",
    accent: "from-hue-pink to-hue-coral",
    // gallery: add recap photos here once they're in /public/images/events.
  },
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
    status: "completed",
    accent: "from-hue-pink via-hue-yellow to-hue-sky",
  },
  {
    slug: "screening",
    emoji: "🎬",
    name: "Awarapan 2 Screening",
    tagline: "Big screen, good company",
    description:
      "Awarapan 2 on the big screen in Bahria Town, with two shows to pick from. Come for the film, stay for the crowd watching it with you.",
    date: "2026-10-24",
    dateLabel: "24th October 2026",
    timeLabel: "3:00 PM & 6:00 PM",
    locationLabel: "Bahria Town",
    priceLabel: `PKR ${PRICING.single.toLocaleString(
      "en-PK"
    )} solo · PKR ${PRICING.duo.toLocaleString("en-PK")} duo`,
    activities: ["🎬 Awarapan 2", "🕒 3:00 PM show", "🕕 6:00 PM show"],
    status: "booking_open",
    accent: "from-hue-sky to-rz-purple-400",
    bookHref: "/book",
    showSlots: true,
  },
  {
    slug: "live-theater",
    emoji: "🎭",
    name: "Live Theater",
    tagline: "Theatre, up close",
    description: "Live performance in a room small enough to feel every line.",
    status: "announced",
    accent: "from-hue-coral to-hue-pink",
    detailsComingSoon: true,
  },
  {
    slug: "basant",
    emoji: "🪁",
    name: "Basant Event",
    tagline: "Kites, colour and rooftop season",
    description: "Basant done the Rami ZeeZ way — details landing closer to the season.",
    status: "announced",
    accent: "from-hue-yellow to-hue-mint",
    detailsComingSoon: true,
  },
  {
    slug: "wedding-event",
    emoji: "💍",
    name: "Wedding Event",
    tagline: "Shaadi season, our way",
    description: "A wedding-season special. More on this one soon.",
    status: "announced",
    accent: "from-hue-pink to-hue-yellow",
    detailsComingSoon: true,
  },
];

const STATUS_LABEL: Record<EventStatus, string> = {
  completed: "Wrapped",
  booking_open: "Booking open",
  announced: "Coming soon",
};

/** Dated-but-unbookable reads as "Tickets soon" rather than "Coming soon". */
export function statusLabel(event: SiteEvent, past = false) {
  if (past || event.status === "completed") return STATUS_LABEL.completed;
  if (event.status === "announced" && event.date) return "Tickets soon";
  return STATUS_LABEL[event.status];
}

export const STATUS_STYLE: Record<EventStatus, string> = {
  completed: "border-white/25 text-rz-cream/60",
  booking_open: "border-hue-mint/40 text-hue-mint",
  announced: "border-hue-yellow/40 text-hue-yellow",
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

/** A dated event moves itself into the past once its day is over. */
export function isPast(event: SiteEvent) {
  if (event.status === "completed") return true;
  return Boolean(event.date && event.date < todayInPakistan());
}

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}

/** Events still to come: booking open first, then announced, dated first. */
export function upcomingEvents(): SiteEvent[] {
  const rank = (e: SiteEvent) => (e.status === "booking_open" ? 0 : 1);
  return EVENTS.filter((e) => !isPast(e)).sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

/** Events that have already happened, most recent first. */
export function pastEvents(): SiteEvent[] {
  return EVENTS.filter(isPast).sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
}
