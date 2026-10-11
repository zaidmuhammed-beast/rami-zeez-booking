export const EVENT = {
  brand: "Rami ZeeZ",
  name: "Awarapan 2 Screening",
  tagline: "Big screen, good company",
  date: "2026-10-24",
  dateLabel: "24th October 2026",
  dateShort: "24 Oct",
  // First show, 3:00 PM Pakistan Standard Time — used by the live countdown.
  startsAt: "2026-10-24T15:00:00+05:00",
  timeLabel: "3:00 PM & 6:00 PM",
  locationLabel: "Bahria Town",
  // Two shows, two spaces of 10 seats each: 20 a show, 40 across the day.
  totalSlots: 40,
  // Bookings made before this date earn the Early Bird badge — adjust as needed.
  earlyBirdCutoff: "2026-10-18",
  whatsappBusinessNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || "923397777234",
  whatsappBusinessDisplay: "+92 339 7777 234",
};

/** Guests pick one of these at booking. Capacity is enforced per show. */
export const SHOW_TIMES = [
  {
    id: "3pm",
    label: "3:00 PM",
    emoji: "🕒",
    note: "Afternoon show",
    capacity: 20,
  },
  {
    id: "6pm",
    label: "6:00 PM",
    emoji: "🕕",
    note: "Evening show",
    capacity: 20,
  },
] as const;

export type ShowTimeId = (typeof SHOW_TIMES)[number]["id"];

export const SHOW_TIME_IDS = SHOW_TIMES.map((s) => s.id) as [
  ShowTimeId,
  ...ShowTimeId[],
];

export function showTimeLabel(id: string | null | undefined) {
  return SHOW_TIMES.find((s) => s.id === id)?.label ?? "—";
}

export const PRICING = {
  single: 1800,
  duo: 3400,
  // A couple pass covers two seats, same as a duo.
  couple: 3400,
};

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
  jammer: { emoji: "🎸", label: "Jammer" },
  coupleGoals: { emoji: "❤️", label: "Couple Goals" },
  quizChampion: { emoji: "👑", label: "Quiz Champion" },
};
