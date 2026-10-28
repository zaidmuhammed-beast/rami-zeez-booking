import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { Countdown } from "@/components/landing/Countdown";
import { FactCard } from "@/components/landing/FactCard";
import { TicketCard } from "@/components/landing/TicketCard";
import { CookingHero } from "@/components/landing/CookingHero";
import { EventTile } from "@/components/events/EventTile";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSlotAvailability, getShowAvailability } from "@/lib/slots";
import { upcomingEvents, pastEvents } from "@/lib/events";
import { EVENT, PRICING } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

// Keep the seat counts reasonably live without hitting Supabase on every visit.
export const revalidate = 30;

const MARQUEE_WORDS = [
  "AWARAPAN 2",
  "SPIDER-MAN",
  "TWO SHOWS",
  "BAHRIA TOWN",
  "1 NOV 2026",
];

/** Last word cool, the rest warm — reads as one wordmark for any event name. */
function Wordmark({ name }: { name: string }) {
  const words = name.split(" ");
  const tail = words.pop();
  return (
    <>
      {words.length > 0 && <span className="hue-text">{words.join(" ")} </span>}
      <span className="hue-text-cool">{tail}</span>
    </>
  );
}

export default async function Home() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  // Everything event-specific below hangs off this: with nothing on sale the
  // page switches to the cooking hero rather than pushing a finished event.
  const onSale = upcoming.find((e) => e.status === "booking_open");
  const inTheWorks = upcoming.filter((e) => e.status !== "booking_open");

  if (!onSale) {
    return (
      <div className="flex-1">
        <SiteHeader />
        <CookingHero />

        {inTheWorks.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 py-10">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-4">
              On the menu
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {inTheWorks.map((event) => (
                <EventTile key={event.slug} event={event} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
              What we&apos;ve thrown
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {past.map((event) => (
                <EventTile key={event.slug} event={event} past />
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
          <GlassCard strong className="relative overflow-hidden p-8 sm:p-10">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-sky"
            />
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Don&apos;t miss the next one 🔔
            </h2>
            <p className="text-rz-cream/75 mb-8">
              Seats go fast and we announce here first.
            </p>
            <a
              href={businessChatLink(
                `Hi ${EVENT.brand}! Let me know when your next event drops 🔔`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
            >
              🔔 Tell me first
            </a>
          </GlassCard>
        </section>

        <SiteFooter />
      </div>
    );
  }

  const { taken, total } = await getSlotAvailability();
  const shows = await getShowAvailability();
  const allSoldOut = shows.every((s) => s.soldOut);

  const facts = [
    { emoji: "📅", label: "Date", value: onSale.dateLabel, note: "Sunday" },
    { emoji: "⏰", label: "Shows", value: onSale.timeLabel, note: "Two films" },
    { emoji: "📍", label: "Location", value: onSale.locationLabel },
    {
      emoji: "🎟",
      label: "Passes",
      value: `From ${PRICING.single.toLocaleString("en-PK")} PKR`,
      note: "Solo or duo",
    },
  ].filter((f): f is typeof f & { value: string } => Boolean(f.value));

  return (
    <div className="flex-1">
      <SiteHeader />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-14 grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="text-center md:text-left">
            <span className="chip mb-6">
              {onSale.emoji} {EVENT.brand} presents
            </span>

            <h1 className="font-display font-extrabold leading-[1.02] tracking-tight text-4xl sm:text-5xl md:text-6xl">
              <Wordmark name={onSale.name} />
            </h1>

            <p className="mt-4 font-display text-xl sm:text-2xl font-bold text-rz-cream/90">
              {onSale.tagline}
            </p>
            <span
              aria-hidden
              className="animate-brush-in mt-3 block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint mx-auto md:mx-0"
            />

            <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto md:mx-0">
              {onSale.description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/book" className="btn-primary text-base">
                {allSoldOut ? "🎟 Join the waitlist" : "🎟 Book Your Seat"}
              </Link>
              <a
                href={businessChatLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-base"
              >
                💬 Questions? Chat on WhatsApp
              </a>
            </div>
            <p className="mt-3 text-sm text-rz-cream/60">
              {EVENT.whatsappBusinessDisplay}
            </p>
            <p className="mt-4 text-sm">
              <Link
                href="/events"
                className="text-rz-cream/70 underline underline-offset-4 decoration-white/25 hover:text-rz-cream transition"
              >
                📅 See all upcoming events
              </Link>
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <span
                aria-hidden
                className="absolute inset-0 m-auto h-48 w-48 md:h-64 md:w-64 rounded-full bg-gradient-to-br from-hue-pink/40 via-hue-yellow/30 to-hue-sky/40 blur-2xl"
              />
              <Mascot
                size={280}
                float
                preload
                className="relative w-44 sm:w-56 md:w-[280px] h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Event details */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facts.map((fact) => (
            <FactCard key={fact.label} {...fact} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- Shows + countdown */}
      <section className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-5">
          <GlassCard className="p-6">
            <p className="text-sm text-rz-cream/70 mb-3">Lights down in…</p>
            <Countdown target={EVENT.startsAt} />
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-center">
            <SlotProgress taken={taken} total={total} />
            <p className="mt-3 text-xs text-rz-cream/55">
              {`${total} seats across the day — ${shows[0]?.capacity ?? 0} a show.`}
            </p>
          </GlassCard>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {shows.map((show) => (
            <GlassCard
              key={show.id}
              className={`p-6 flex items-center justify-between gap-4 ${
                show.soldOut ? "opacity-60" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="font-display text-xl font-extrabold leading-tight">
                  {show.emoji} {show.film}
                </p>
                <p className="text-sm text-rz-cream/70 mt-1">
                  {show.label} · {show.note}
                </p>
              </div>
              <span
                className={`chip text-xs ${
                  show.soldOut
                    ? "text-rz-cream/50"
                    : show.remaining <= 5
                    ? "border-rz-amber-400/50 text-rz-amber-400"
                    : "border-hue-mint/40 text-hue-mint"
                }`}
              >
                {show.soldOut ? "Sold out" : `${show.remaining} seats left`}
              </span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Marquee */}
      <section
        aria-hidden
        className="overflow-hidden py-4 border-y border-white/10 bg-white/[0.04]"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE_WORDS.map((word) => (
                <span
                  key={`${copy}-${word}`}
                  className="font-display font-extrabold text-lg sm:text-xl text-rz-cream/45 px-6 whitespace-nowrap"
                >
                  {word}
                  <span className="text-hue-pink"> ●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Tickets */}
      <section id="tickets" className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Pick your pass
        </h2>
        <p className="mt-3 text-center text-rz-cream/70">
          You choose your film — Awarapan 2 at 3:00 PM, or Spider-Man at 6:00
          PM — at checkout.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          <TicketCard
            emoji="👤"
            name="Solo"
            seats="1 seat · 1 show"
            price={PRICING.single}
            accent="from-hue-sky to-hue-mint"
            perks={[
              "Your seat at the film you pick",
              "Awarapan 2 or Spider-Man on the big screen",
              `${EVENT.locationLabel}, ${EVENT.dateShort}`,
            ]}
          />
          <TicketCard
            emoji="👬"
            name="Duo"
            seats="2 seats · same show"
            price={PRICING.duo}
            accent="from-hue-pink to-hue-yellow"
            highlight
            note={`Saves PKR ${(PRICING.single * 2 - PRICING.duo).toLocaleString(
              "en-PK"
            )} against two solo passes`}
            perks={[
              "Two seats, side by side",
              "Awarapan 2 or Spider-Man on the big screen",
              `${EVENT.locationLabel}, ${EVENT.dateShort}`,
            ]}
          />
        </div>

        <p className="mt-6 text-center text-xs text-rz-cream/50">
          Payment by bank transfer or wallet — upload your screenshot at the end
          of booking and we confirm on WhatsApp.
        </p>
      </section>

      {/* ---------------------------------------------------------- Final CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <GlassCard strong className="relative overflow-hidden p-8 sm:p-10">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-sky"
          />
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            {allSoldOut ? "Both shows are full 🙌" : "Grab your seat 🎬"}
          </h2>
          <p className="text-rz-cream/75 mb-8">
            {onSale.dateLabel} · {onSale.timeLabel} · {onSale.locationLabel}.
            {allSoldOut
              ? " Message us and we'll let you know if a seat frees up."
              : ` Only ${total} seats, and they go in a day or two.`}
          </p>
          <Link href="/book" className="btn-primary text-base">
            {allSoldOut ? "🎟 Join the waitlist" : "🎟 Book Your Seat"}
          </Link>
        </GlassCard>
      </section>

      <SiteFooter />
    </div>
  );
}
