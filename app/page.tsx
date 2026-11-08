import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { Countdown } from "@/components/landing/Countdown";
import { FactCard } from "@/components/landing/FactCard";
import { ActivityCard } from "@/components/landing/ActivityCard";
import { TicketCard } from "@/components/landing/TicketCard";
import { CookingHero } from "@/components/landing/CookingHero";
import { EventTile } from "@/components/events/EventTile";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSlotAvailability } from "@/lib/slots";
import { upcomingEvents, pastEvents } from "@/lib/events";
import { EVENT, PRICING_TIERS, isEarlyBird, pricing } from "@/lib/constants";
import { formatPkr } from "@/lib/format";
import { businessChatLink } from "@/lib/whatsapp";

// Keep the seat counts — and the early-bird price — reasonably live without
// hitting Supabase on every visit.
export const revalidate = 30;

const MARQUEE_WORDS = [
  "BEDAZZLE",
  "RHINESTONES",
  "20 SEATS ONLY",
  "GO FLOUR GULBERG",
  "22 NOV 2026",
];

const WHAT_HAPPENS = [
  {
    emoji: "💎",
    title: "Bedazzle",
    description:
      "Rhinestones, pearls and studs, and three hours to cover something plain until it catches the light.",
    accent: "from-hue-pink to-hue-coral",
  },
  {
    emoji: "🪡",
    title: "Learn the trick",
    description:
      "Placement, patterns, and setting stones properly — so they're still on next week, not on the floor.",
    accent: "from-hue-sky to-rz-purple-400",
  },
  {
    emoji: "🧑‍🤝‍🧑",
    title: "Twenty people",
    description:
      "One long table and a room capped at twenty, small enough that you leave actually knowing everyone.",
    accent: "from-hue-yellow to-hue-mint",
  },
  {
    emoji: "📸",
    title: "Take it home",
    description:
      "Whatever you bedazzle leaves with you at six, along with the photos of it.",
    accent: "from-hue-mint to-hue-sky",
  },
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
  const soldOut = taken >= total;
  const early = isEarlyBird();
  const tier = pricing();

  const facts = [
    { emoji: "📅", label: "Date", value: onSale.dateLabel, note: EVENT.dayLabel },
    { emoji: "⏰", label: "Time", value: onSale.timeLabel, note: "Three hours" },
    { emoji: "📍", label: "Location", value: onSale.locationLabel },
    {
      emoji: "🎟",
      label: "Passes",
      value: `From ${tier.single.toLocaleString("en-PK")} PKR`,
      note: early ? `Until ${EVENT.earlyBirdShort}` : "Solo or duo",
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
              className="animate-brush-in mt-3 block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-sky to-hue-mint mx-auto md:mx-0"
            />

            <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto md:mx-0">
              {onSale.description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/book" className="btn-primary text-base">
                {soldOut ? "🎟 Join the waitlist" : "🎟 Book Your Seat"}
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

            <p className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
              {early ? (
                <span className="chip border-hue-mint/50 text-hue-mint">
                  {`💜 Early bird ${formatPkr(
                    PRICING_TIERS.earlyBird.single
                  )} — until ${EVENT.earlyBirdLabel}`}
                </span>
              ) : (
                <span className="chip border-rz-amber-400/50 text-rz-amber-400">
                  {`🎟 ${formatPkr(PRICING_TIERS.regular.single)} — early bird closed`}
                </span>
              )}
              <span className="chip">{`💎 ${EVENT.totalSlots} seats only`}</span>
            </p>

            <p className="mt-4 text-sm text-rz-cream/60">
              {EVENT.whatsappBusinessDisplay}
            </p>
            <p className="mt-3 text-sm">
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
                className="absolute inset-0 m-auto h-48 w-48 md:h-64 md:w-64 rounded-full bg-gradient-to-br from-hue-pink/40 via-hue-sky/30 to-hue-mint/40 blur-2xl"
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

      {/* ---------------------------------------------------- Countdown + seats */}
      <section className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-5">
          <GlassCard className="p-6">
            <p className="text-sm text-rz-cream/70 mb-3">Stones come out in…</p>
            <Countdown target={EVENT.startsAt} />
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-center">
            <SlotProgress taken={taken} total={total} />
            <p className="mt-3 text-xs text-rz-cream/55">
              {`${total} seats, one session — ${EVENT.timeLabel} at ${EVENT.locationLabel}.`}
            </p>
          </GlassCard>
        </div>

        {/* The price ladder: whichever tier is live gets the ring. */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <GlassCard
            className={`p-6 flex items-center justify-between gap-4 ${
              early ? "ring-1 ring-hue-mint/50" : "opacity-55"
            }`}
          >
            <div className="min-w-0">
              <p className="font-display text-2xl font-extrabold leading-tight">
                {formatPkr(PRICING_TIERS.earlyBird.single)}
              </p>
              <p className="text-sm text-rz-cream/70 mt-1">
                {`Early bird · book by ${EVENT.earlyBirdLabel}`}
              </p>
            </div>
            <span
              className={`chip text-xs shrink-0 ${
                early ? "border-hue-mint/40 text-hue-mint" : "text-rz-cream/50"
              }`}
            >
              {early ? "Live now" : "Closed"}
            </span>
          </GlassCard>

          <GlassCard
            className={`p-6 flex items-center justify-between gap-4 ${
              early ? "opacity-70" : "ring-1 ring-rz-amber-400/50"
            }`}
          >
            <div className="min-w-0">
              <p className="font-display text-2xl font-extrabold leading-tight">
                {formatPkr(PRICING_TIERS.regular.single)}
              </p>
              <p className="text-sm text-rz-cream/70 mt-1">
                {`Regular · from ${EVENT.regularFromLabel}`}
              </p>
            </div>
            <span className="chip text-xs shrink-0 border-rz-amber-400/40 text-rz-amber-400">
              {early ? "Price goes up" : "Live now"}
            </span>
          </GlassCard>
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

      {/* ------------------------------------------------------- What happens */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          What goes down
        </h2>
        <p className="mt-3 text-center text-rz-cream/70">
          {`Three hours, ${EVENT.totalSlots} seats, one very sparkly table.`}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHAT_HAPPENS.map((item) => (
            <ActivityCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Tickets */}
      <section id="tickets" className="mx-auto max-w-4xl px-6 pb-12 md:pb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Pick your pass
        </h2>
        <p className="mt-3 text-center text-rz-cream/70">
          {early
            ? `Early-bird prices hold until ${EVENT.earlyBirdLabel} — after that every pass goes up.`
            : "Early-bird pricing has closed — these are the prices at the table."}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          <TicketCard
            emoji="👤"
            name="Solo"
            seats="1 seat"
            price={tier.single}
            accent="from-hue-sky to-hue-mint"
            tag={early ? "Early bird" : undefined}
            note={
              early
                ? `${formatPkr(PRICING_TIERS.regular.single)} from ${
                    EVENT.regularFromShort
                  }`
                : undefined
            }
            perks={[
              "Your seat at the table",
              "Stones, studs and the full how-to",
              `${EVENT.locationLabel}, ${EVENT.dateShort}`,
            ]}
          />
          <TicketCard
            emoji="👬"
            name="Duo"
            seats="2 seats, side by side"
            price={tier.duo}
            accent="from-hue-pink to-hue-yellow"
            highlight
            tag="Best value"
            note={`Saves PKR ${(tier.single * 2 - tier.duo).toLocaleString(
              "en-PK"
            )} against two solo passes${
              early
                ? ` · ${formatPkr(PRICING_TIERS.regular.duo)} from ${
                    EVENT.regularFromShort
                  }`
                : ""
            }`}
            perks={[
              "Two seats, one table",
              "Stones, studs and the full how-to",
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
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-sky to-hue-mint"
          />
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            {soldOut ? "All twenty seats are gone 🙌" : "Grab a seat 💎"}
          </h2>
          <p className="text-rz-cream/75 mb-8">
            {`${onSale.dateLabel} · ${onSale.timeLabel} · ${onSale.locationLabel}.`}
            {soldOut
              ? " Message us and we'll let you know if one frees up."
              : early
              ? ` Only ${total} seats, and the price goes up after ${EVENT.earlyBirdLabel}.`
              : ` Only ${total} seats, and they go in a day or two.`}
          </p>
          <Link href="/book" className="btn-primary text-base">
            {soldOut ? "🎟 Join the waitlist" : "🎟 Book Your Seat"}
          </Link>
        </GlassCard>
      </section>

      <SiteFooter />
    </div>
  );
}
