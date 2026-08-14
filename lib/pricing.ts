import { PRICING, type GroupType } from "./constants";

export function computeTicket(groupType: GroupType, numParticipants: number) {
  if (groupType === "couple") {
    return { ticketType: "Couple Pass", amount: PRICING.couple };
  }
  if (groupType === "duo") {
    return { ticketType: "Duo Pass", amount: PRICING.single * 2 };
  }
  void numParticipants;
  return { ticketType: "Single Pass", amount: PRICING.single };
}
