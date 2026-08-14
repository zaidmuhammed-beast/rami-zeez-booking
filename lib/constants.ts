export const EVENT = {
  name: "Rami ZeeZ Mehfil",
  date: "2026-08-23",
  dateLabel: "23rd August",
  totalSlots: 50,
  // Bookings made before this date earn the Early Bird badge — adjust as needed.
  earlyBirdCutoff: "2026-08-09",
  whatsappBusinessNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || "923397777234",
  whatsappBusinessDisplay: "+92 339 7777 234",
};

export const PRICING = {
  single: 1899,
  couple: 3499,
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
  "Sadapay",
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
