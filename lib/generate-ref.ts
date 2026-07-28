import { customAlphabet } from "nanoid";

// No 0/O/1/I to avoid confusing guests reading it off their phone screen.
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const nano = customAlphabet(alphabet, 6);

export function generateBookingRef() {
  return `RZ-${nano()}`;
}

export function generateReferralCode() {
  return nano();
}

export function generateLuckyDrawToken() {
  return `LD-${nano()}`;
}
