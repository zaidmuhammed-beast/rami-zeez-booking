import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSlotAvailability } from "@/lib/slots";
import { EVENTS, getEvent, isPast, STATUS_LABEL, STATUS_STYLE } from "@/lib/events";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

export const revalidate = 30;

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: `Event — ${EVENT.brand}` };

  return {
    title: `${event.name} — ${EVENT.brand}`,
    description: event.description,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const past = isPast(event);
  const status = past ? "completed" : event.status;
  const { taken, total } = await getSlotAvailability();

  const facts = [
    { emoji: "📅", label: "Date", value: event.dateLabel },
    { emoji: "⏰", label: "Time", value: event.timeLabel },
    { emoji: "📍", label: "Location", value: event.locationLabel },
    { emoji: "🎟", label: "Passes", value: event.priceLabel },
  ].filter((fact): fact is typeof fact & { value: string } => Boolean(fact.value));

  return (
    <div className="flex-1">
      <SiteHeader />

      {/* ------------------------------------------------------------- Header */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-3xl px-6 pt-12 pb-8 md:pt-16">
          <Link
            href="/events"
            className="text-sm text-rz-cream/60 hover:text-rz-cream transition"
          >
            ← All events
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-4xl">{event.emoji}</span>
            <span className={`chip text-xs ${STATUS_STYLE[status]}`}>
              {STATUS_LABEL[status]}
            </span>
          </div>

          <h1 className="mt-4 font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-5xl">
            {event.name}
          </h1>
          <p className="mt-2 font-display text-lg font-bold text-rz-cream/80">
            {event.tagline}
          </p>
          <span
            aria-hidden
            className={`animate-brush-in mt-4 block h-1.5 w-32 rounded-full bg-gradient-to-r ${event.accent}`}
          />
          <p className="mt-6 text-lg text-rz-cream/80">{event.description}</p>
        </div>
      </section>

      {/* -------------------------------------------------------------- Body */}
      <section className="mx-auto max-w-3xl px-6 pb-8">
        {event.detailsComingSoon ? (
          <GlassCard strong className="relative overflow-hidden p-8 text-center">
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${event.accent}`}
            />
            <span className="text-4xl">🕒</span>
            <h2 className="font-display text-2xl font-bold mt-3">
              {past ? "Recap coming soon" : "Details coming soon"}
            </h2>
            <p className="mt-3 text-rz-cream/75 max-w-md mx-auto">
              {past
                ? "We're putting the photos and highlights together. Check back shortly."
                : "Date, venue, line-up and passes are being locked in. We'll post them here first."}
            </p>
            <a
              href={businessChatLink(
                `Hi ${EVENT.brand}! I'd like details about ${event.name} 👀`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-7"
            >
              💬 Ask us on WhatsApp
            </a>
          </GlassCard>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.map((fact) => (
                <GlassCard key={fact.label} className="p-5 flex items-start gap-3">
                  <span className="text-2xl leading-none">{fact.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-rz-cream/55">
                      {fact.label}
                    </p>
                    <p className="font-display font-bold leading-snug">
                      {fact.value}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {event.activities && event.activities.length > 0 && (
              <GlassCard className="mt-5 p-6">
                <p className="font-semibold mb-3">
                  {past ? "What happened" : "What's happening"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.activities.map((activity) => (
                    <span key={activity} className="chip text-sm">
                      {activity}
                    </span>
                  ))}
                </div>
              </GlassCard>
            )}

            {event.showSlots && (
              <GlassCard className="mt-5 p-6">
                <SlotProgress taken={taken} total={total} />
              </GlassCard>
            )}

            {event.gallery && event.gallery.length > 0 && (
              <div className="mt-8">
                <p className="font-semibold mb-3">From the night 📸</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.gallery.map((photo) => (
                    <div
                      key={photo.src}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-white/15"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {past && !event.gallery?.length && (
              <p className="mt-8 text-center text-sm text-rz-cream/55">
                📸 Photos from this one are on the way.
              </p>
            )}

            {!past && event.bookHref && (
              <div className="mt-8 text-center">
                <Link href={event.bookHref} className="btn-primary text-base">
                  🎟 Book Your Spot
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-4 pb-16 text-center">
        <Link href="/events" className="btn-ghost">
          ← Back to all events
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
