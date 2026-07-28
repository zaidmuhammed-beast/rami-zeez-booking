import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBookingByRef } from "@/lib/bookings-server";
import { generateQrDataUrl } from "@/lib/qr";
import { daysUntil } from "@/lib/countdown";
import { customerToBusinessLink } from "@/lib/whatsapp";
import { EVENT } from "@/lib/constants";
import { formatPkr } from "@/lib/format";
import { getEarnedBadges } from "@/lib/badges";
import { getSiteOrigin } from "@/lib/site-url";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { BadgeChip } from "@/components/ui/BadgeChip";
import { ReferralShare } from "@/components/booking/ReferralShare";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const booking = await getBookingByRef(ref);

  if (!booking) notFound();

  const qrDataUrl = await generateQrDataUrl(booking.booking_ref);
  const daysLeft = daysUntil(EVENT.date);
  const isConfirmed = booking.status !== "pending_payment";
  const badges = getEarnedBadges(booking);
  const origin = await getSiteOrigin();
  const referralLink = `${origin}/book?ref=${booking.referral_code}`;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16">
      <div className="flex justify-center mb-4">
        <Mascot size={160} />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-center mb-2">
        🎉 Welcome to the Rami ZeeZ Family!
      </h1>
      <p className="text-center text-rz-cream/75 mb-8">
        Your booking has been received. See you at the Mehfil! 💜
      </p>

      <GlassCard strong className="p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <span
            className={`chip ${
              isConfirmed
                ? "border-emerald-400/40 text-emerald-300"
                : "border-amber-400/40 text-amber-300"
            }`}
          >
            {isConfirmed ? "✅ Paid & Confirmed" : "⏳ Payment Under Review"}
          </span>
          <span className="text-sm text-rz-cream/60">{booking.booking_ref}</span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="rounded-2xl overflow-hidden border border-white/20 bg-rz-cream p-3">
            <Image
              src={qrDataUrl}
              alt={`QR code for booking ${booking.booking_ref}`}
              width={220}
              height={220}
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-rz-cream/60">📅 Date</span>
            <span className="font-semibold">{EVENT.dateLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-rz-cream/60">🎟 Ticket Type</span>
            <span className="font-semibold">{booking.ticket_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-rz-cream/60">💰 Amount</span>
            <span className="font-semibold">{formatPkr(booking.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-rz-cream/60">☕ Coffee</span>
            <span className="font-semibold">Reserved</span>
          </div>
          {daysLeft > 0 && (
            <div className="flex justify-between">
              <span className="text-rz-cream/60">⏳ Countdown</span>
              <span className="font-semibold">{daysLeft} days to go</span>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-6 mb-6">
        <p className="font-semibold mb-3">Bring:</p>
        <ul className="space-y-1.5 text-sm text-rz-cream/80">
          {booking.group_type === "couple" && <li>❤️ Your Partner</li>}
          <li>🎉 Good Vibes</li>
          <li>😎 Your Selection</li>
        </ul>
        <p className="mt-4 text-xs text-rz-cream/50">
          📍 Venue details will be shared shortly before the event.
        </p>
      </GlassCard>

      <GlassCard className="p-6 mb-6">
        <p className="font-semibold mb-3">Your Badges 🏅</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((key) => (
            <BadgeChip key={key} badgeKey={key} />
          ))}
        </div>
        <p className="mt-3 text-xs text-rz-cream/50">
          Screenshot this and share on Instagram 📸
        </p>
      </GlassCard>

      <ReferralShare link={referralLink} />

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={customerToBusinessLink(booking)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1"
        >
          💬 Confirm on WhatsApp
        </a>
        <Link href="/" className="btn-ghost flex-1">
          🏠 Back Home
        </Link>
      </div>
    </div>
  );
}
