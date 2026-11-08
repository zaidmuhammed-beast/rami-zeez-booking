export const EVENT = {
  brand: "Rami ZeeZ",
  name: "Bedazzle Workshop",
  tagline: "Bling & Connect",
  date: "2026-11-22",
  dateLabel: "22nd November 2026",
  dateShort: "22 Nov",
  dayLabel: "Sunday",
  startsAt: "2026-11-22T15:00:00+05:00",
  timeLabel: "3:00 PM – 6:00 PM",
  locationLabel: "Go Flour, Gulberg",
  // One session, one table: twenty seats for the day.
  totalSlots: 20,
  // Early-bird pricing runs to the end of 15 Nov in Pakistan. After that the
  // regular price applies — enforced server-side, see lib/pricing.ts.
  earlyBirdEndsAt: "2026-11-16T00:00:00+05:00",
  earlyBirdLabel: "15th November",
  earlyBirdShort: "15 Nov",
  regularFromLabel: "16th November",
  regularFromShort: "16 Nov",
  whatsappBusinessNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || "923397777234",
  whatsappBusinessDisplay: "+92 339 7777 234",
};

/**
 * The sessions guests can book, each with its own capacity. There's only one
 * this time, so the booking flow skips the picker and selects it for them.
 */
export const SHOW_TIMES = [
  {
    id: "main",
    label: "3:00 PM – 6:00 PM",
    emoji: "💎",
    note: "One session, 20 seats",
    capacity: 20,
  },
] as const;

export type ShowTimeId = (typeof SHOW_TIMES)[number]["id"];

export const SHOW_TIME_IDS = SHOW_TIMES.map((s) => s.id) as [
  ShowTimeId,
  ...ShowTimeId[],
];

export const SINGLE_SESSION = SHOW_TIMES.length === 1 ? SHOW_TIMES[0] : null;

/** Falls back to the stored value so bookings from past events still read. */
export function showTimeLabel(id: string | null | undefined) {
  return SHOW_TIMES.find((s) => s.id === id)?.label ?? id ?? "—";
}

export const PRICING_TIERS = {
  earlyBird: { single: 1800, duo: 3400, couple: 3400 },
  regular: { single: 2200, duo: 4200, couple: 4200 },
} as const;

export function isEarlyBird(at: Date | string | number = Date.now()) {
  return new Date(at).getTime() < new Date(EVENT.earlyBirdEndsAt).getTime();
}

/** Prices as they stand at `at` — early-bird before the cutoff, regular after. */
export function pricing(at: Date | string | number = Date.now()) {
  return isEarlyBird(at) ? PRICING_TIERS.earlyBird : PRICING_TIERS.regular;
}

export type GroupType = "single" | "duo" | "couple";

export const GROUP_MEME: Record<GroupType, { emoji: string; title: string }> = {
  single: {
    emoji: "👤",
    title: "Solo Harami Soul",
  },
  duo: {
    emoji: "👬",
    title: "Dosti Squad",
  },
  couple: {
    emoji: "❤️",
    title: "Couple Goals",
  },
};

export const FUN_QUESTIONS = [
  { key: "saysSorryFirst", emoji: "❤️", label: "Who says “Sorry” first?" },
  { key: "startsArguments", emoji: "😂", label: "Who starts the arguments?" },
  { key: "teaOrCoffee", emoji: "☕", label: "Tea or Coffee?" },
  { key: "favoriteSong", emoji: "🎤", label: "Your current favorite song?" },
  { key: "comfortFood", emoji: "🍕", label: "Favorite comfort food?" },
  { key: "movieOrNetflix", emoji: "🎬", label: "Movie or Netflix?" },
  { key: "repliesLate", emoji: "😴", label: "Who replies late?" },
] as const;

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "Easypaisa",
  "JazzCash",
  "Nayapay",
] as const;

export const RELATIONSHIP_DURATIONS = [
  "Less than 6 Months",
  "6-12 Months",
  "1-3 Years",
  "3+ Years",
] as const;

export const BADGES = {
  earlyBird: { emoji: "💜", label: "Early Bird" },
  coffeeLover: { emoji: "☕", label: "Coffee Lover" },
  bedazzler: { emoji: "💎", label: "Bedazzler" },
  coupleGoals: { emoji: "❤️", label: "Couple Goals" },
  quizChampion: { emoji: "👑", label: "Quiz Champion" },
};
