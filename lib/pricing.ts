import { pricing, type GroupType } from "./constants";

/**
 * The price of a pass, at the tier in force right now. The server recomputes
 * this on submit, so a stale page can't buy a seat at yesterday's price.
 */
export function computeTicket(
  groupType: GroupType,
  numParticipants: number,
  at: Date | string | number = Date.now()
) {
  const tier = pricing(at);

  if (groupType === "couple") {
    return { ticketType: "Couple Pass", amount: tier.couple };
  }
  if (groupType === "duo") {
    return { ticketType: "Duo Pass", amount: tier.duo };
  }
  void numParticipants;
  return { ticketType: "Single Pass", amount: tier.single };
}
