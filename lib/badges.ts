import { BADGES, EVENT } from "./constants";
import type { Booking } from "./types";

export type BadgeKey = keyof typeof BADGES;

export function getEarnedBadges(booking: Booking): BadgeKey[] {
  const earned: BadgeKey[] = [];

  if (new Date(booking.created_at).getTime() < new Date(EVENT.earlyBirdCutoff).getTime()) {
    earned.push("earlyBird");
  }
  if (booking.coffee_claimed) earned.push("coffeeLover");
  earned.push("jammer");
  if (booking.group_type === "couple") earned.push("coupleGoals");
  if (booking.badges?.includes("quizChampion")) earned.push("quizChampion");

  return earned;
}
