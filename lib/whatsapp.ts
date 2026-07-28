import { EVENT } from "./constants";
import type { Booking } from "./types";

function toWaNumber(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

export function buildWaLink(phone: string, message: string) {
  const number = toWaNumber(phone);
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export function customerToBusinessLink(booking: Pick<Booking, "booking_ref" | "primary_name" | "ticket_type">) {
  const message = `Hi Rami ZeeZ! 👋 I just booked my spot for the Mehfil.\n\nName: ${booking.primary_name}\nBooking Ref: ${booking.booking_ref}\nTicket: ${booking.ticket_type}\n\nHere's my payment screenshot for confirmation!`;
  return buildWaLink(EVENT.whatsappBusinessNumber, message);
}

export function confirmationTemplate(booking: Booking) {
  return `🎉 Welcome to the Rami ZeeZ Family!

Your booking has been confirmed.
📅 Date: ${EVENT.dateLabel}
🎟 Ticket Type: ${booking.ticket_type}
☕ Your free coffee is reserved!

Bring:
❤️ Your Partner (if applicable)
🎉 Good Vibes
😎 Your Selection

📍 Venue details will be shared shortly before the event.

See you at the Mehfil! 💜

Booking Ref: ${booking.booking_ref}`;
}

export function adminToCustomerLink(booking: Booking) {
  const target = booking.primary_whatsapp || booking.primary_phone;
  return buildWaLink(target, confirmationTemplate(booking));
}

export function businessChatLink(prefill?: string) {
  return buildWaLink(
    EVENT.whatsappBusinessNumber,
    prefill || "Hi Rami ZeeZ! I have a question about the upcoming Mehfil 👀"
  );
}
