import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { EVENT } from "@/lib/constants";
import { upcomingEvents } from "@/lib/events";
import { businessChatLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Book Your Spot — ${EVENT.name}`,
};

export default function BookPage() {
  const onSale = upcomingEvents().find((e) => e.status === "booking_open");

  // Nothing on sale — never take a payment for an event that's already run.
  if (!onSale) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={160} className="w-32 h-auto" />
        </div>
        <GlassCard strong className="relative overflow-hidden p-8">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-sky"
          />
          <span className="text-4xl">👨‍🍳</span>
          <h1 className="font-display text-2xl font-bold mt-3">
            Bookings are closed for now
          </h1>
          <p className="mt-3 text-rz-cream/75">
            The next one is still cooking. Dates and passes land on the events
            page first — or message us and we&apos;ll tell you the moment
            tickets open.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/events" className="btn-primary">
              📅 See what&apos;s coming
            </Link>
            <a
              href={businessChatLink(
                `Hi ${EVENT.brand}! Let me know when booking opens 🔔`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              🔔 Tell me first
            </a>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  );
}
