import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { EventCard } from "@/components/events/EventCard";
import { EventTile } from "@/components/events/EventTile";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSlotAvailability } from "@/lib/slots";
import { upcomingEvents, pastEvents } from "@/lib/events";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

// Matches the landing page: keeps the slot counter fresh without hitting
// Supabase on every visit.
export const revalidate = 30;

export const metadata: Metadata = {
  title: `Upcoming Events — ${EVENT.brand}`,
  description: `Every ${EVENT.brand} event — what's on next, what's in the works, and what we've already thrown.`,
};

export default async function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  const { taken, total } = await getSlotAvailability();

  const open = upcoming.filter((e) => e.status === "booking_open");
  const inTheWorks = upcoming.filter((e) => e.status !== "booking_open");

  return (
    <div className="flex-1">
      {/* ---------------------------------------------------------- Page head */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-10 md:pt-20 md:pb-12 text-center">
          <span className="chip mb-6">🎪 {EVENT.brand}</span>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl">
            <span className="hue-text">Upcoming</span>{" "}
            <span className="hue-text-cool">Events</span>
          </h1>
          <span
            aria-hidden
            className="animate-brush-in mt-4 mx-auto block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint"
          />
          <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto">
            What&apos;s on next, what&apos;s in the works, and what we&apos;ve
            already thrown. Seats are limited every time, so book early.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ Next up */}
      {open.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pb-4">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-4">
            Next up
          </h2>
          <div className="space-y-6">
            {open.map((event) => (
              <EventCard
                key={event.slug}
                event={event}
                slots={
                  event.showSlots ? (
                    <SlotProgress taken={taken} total={total} />
                  ) : undefined
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- In the works */}
      {inTheWorks.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-4">
            In the works
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {inTheWorks.map((event) => (
              <EventTile key={event.slug} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------ More to come */}
      <section className="mx-auto max-w-4xl px-6 py-4">
        <GlassCard className="relative overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <span className="text-2xl">✨</span>
              <h2 className="font-display text-xl font-bold mt-2">
                Want in early?
              </h2>
              <p className="mt-2 text-sm text-rz-cream/70 max-w-lg">
                Dates and passes get announced here first. Drop us a message and
                we&apos;ll put you on the list before they go public.
              </p>
            </div>
            <a
              href={businessChatLink(
                `Hi ${EVENT.brand}! Keep me posted about your next event 🎉`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost shrink-0"
            >
              💬 Notify me
            </a>
          </div>
        </GlassCard>
      </section>

      {/* -------------------------------------------------------- Past events */}
      {past.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-4">
            Already happened
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map((event) => (
              <EventTile key={event.slug} event={event} past />
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- Back */}
      <section className="mx-auto max-w-4xl px-6 pt-4 pb-16 text-center">
        <Link href="/" className="btn-ghost">
          ← Back to home
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
