import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { EventCard } from "@/components/events/EventCard";
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
  description: `Every ${EVENT.brand} event with dates, timings and passes. Book the next one before the seats go.`,
};

export default async function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  const { taken, total } = await getSlotAvailability();

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
            Everything we&apos;re putting on next — dates, timings and passes in
            one place. Seats are limited every time, so book early.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- Next up */}
      <section className="mx-auto max-w-4xl px-6 pb-8">
        {upcoming.length > 0 ? (
          <div className="space-y-6">
            {upcoming.map((event) => (
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
        ) : (
          <GlassCard strong className="p-8 text-center">
            <span className="text-3xl">🎨</span>
            <h2 className="font-display text-2xl font-bold mt-3">
              Nothing on the calendar right now
            </h2>
            <p className="mt-3 text-rz-cream/75">
              The next one is in the works. Message us on WhatsApp and we&apos;ll
              tell you the moment tickets open.
            </p>
          </GlassCard>
        )}
      </section>

      {/* ------------------------------------------------------ More to come */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <GlassCard className="relative overflow-hidden p-6 sm:p-8 border-dashed">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <span className="text-2xl">✨</span>
              <h2 className="font-display text-xl font-bold mt-2">
                More coming soon
              </h2>
              <p className="mt-2 text-sm text-rz-cream/70 max-w-lg">
                New editions get announced here first. Drop us a message and
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

      {/* --------------------------------------------------------- Past events */}
      {past.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-display text-xl font-bold mb-5 text-rz-cream/80">
            Already happened
          </h2>
          <div className="space-y-5">
            {past.map((event) => (
              <EventCard key={event.slug} event={event} past />
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
