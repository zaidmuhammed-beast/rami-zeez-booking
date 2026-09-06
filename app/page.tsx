import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { Countdown } from "@/components/landing/Countdown";
import { FactCard } from "@/components/landing/FactCard";
import { ActivityCard } from "@/components/landing/ActivityCard";
import { TicketCard } from "@/components/landing/TicketCard";
import { getSlotAvailability } from "@/lib/slots";
import { EVENT, PRICING } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

// Keep the slot counter reasonably live without hitting Supabase on every visit.
export const revalidate = 30;

const FACTS = [
  { emoji: "📅", label: "Date", value: EVENT.dateLabel, note: "Sunday" },
  { emoji: "⏰", label: "Time", value: EVENT.timeLabel, note: "3 hours of colour" },
  {
    emoji: "📍",
    label: "Location",
    value: EVENT.locationLabel,
    note: "Dropping in your WhatsApp",
  },
  {
    emoji: "🎟",
    label: "Passes",
    value: `From ${PRICING.single.toLocaleString("en-PK")} PKR`,
    note: "Solo or duo",
  },
];

const ACTIVITIES = [
  {
    emoji: "🎨",
    title: "Paint",
    description:
      "Grab a canvas, pick your shade, and make something that is entirely yours. No skill required — messy is the point.",
    accent: "from-hue-pink to-hue-coral",
  },
  {
    emoji: "🎸",
    title: "Jam",
    description:
      "Live music running through the evening. Sing along, take the mic, or just let the room carry you.",
    accent: "from-hue-yellow to-hue-coral",
  },
  {
    emoji: "🎲",
    title: "Games",
    description:
      "Different games all evening, built to break the ice fast. You will know half the room by the second round.",
    accent: "from-hue-mint to-hue-sky",
  },
];

const MARQUEE_WORDS = [
  "PAINT",
  "JAM",
  "GAMES",
  "CONNECT",
  "HUE & YOU 1.0",
  "20 SEP 2026",
];

export default async function Home() {
  const { taken, total } = await getSlotAvailability();

  return (
    <div className="flex-1">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-14 grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="text-center md:text-left">
            <span className="chip mb-6">
              🎨 {EVENT.brand} presents · Edition 1.0
            </span>

            <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-7xl">
              <span className="hue-text">HUE</span>
              <span className="text-rz-cream/45"> &amp; </span>
              <span className="hue-text-cool">YOU</span>
              <span className="ml-3 align-super text-xl sm:text-2xl text-rz-cream/60">
                1.0
              </span>
            </h1>

            <p className="mt-4 font-display text-xl sm:text-2xl font-bold text-rz-cream/90">
              {EVENT.tagline}
            </p>
            <span
              aria-hidden
              className="animate-brush-in mt-3 block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint mx-auto md:mx-0"
            />

            <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto md:mx-0">
              One evening, a room full of canvases, live music and strangers who
              don&apos;t stay strangers. Paint something, play something, leave
              with people worth texting.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/book" className="btn-primary text-base">
                🎟 Book Your Spot
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
          {FACTS.map((fact) => (
            <FactCard key={fact.label} {...fact} />
          ))}
        </div>
      </section>

      {/* --------------------------------------------- Countdown + slots left */}
      <section className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-5">
          <GlassCard className="p-6">
            <p className="text-sm text-rz-cream/70 mb-3">
              Brushes down in…
            </p>
            <Countdown target={EVENT.startsAt} />
          </GlassCard>
          <GlassCard className="p-6 flex flex-col justify-center">
            <SlotProgress taken={taken} total={total} />
            <p className="mt-3 text-xs text-rz-cream/55">
              {`Only ${EVENT.totalSlots} seats — every canvas is spoken for once they're gone.`}
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ------------------------------------------------------------ Marquee */}
      <section aria-hidden className="overflow-hidden py-4 border-y border-white/10 bg-white/[0.04]">
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

      {/* --------------------------------------------------------- Activities */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          What happens at HUE &amp; YOU
        </h2>
        <p className="mt-3 text-center text-rz-cream/70 max-w-xl mx-auto">
          Three hours, three ways to lose track of time.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACTIVITIES.map((activity) => (
            <ActivityCard key={activity.title} {...activity} />
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-rz-cream/60">
          ☕ Every pass comes with a coffee on us. Non-negotiable.
        </p>
      </section>

      {/* ------------------------------------------------------------ Tickets */}
      <section id="tickets" className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Pick your pass
        </h2>
        <p className="mt-3 text-center text-rz-cream/70">
          Come alone and leave with a crew, or bring your person along.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          <TicketCard
            emoji="👤"
            name="Solo"
            seats="1 seat · 1 canvas"
            price={PRICING.single}
            accent="from-hue-sky to-hue-mint"
            perks={[
              "Your own canvas and paints session",
              "Jam session + all the games",
              "Free coffee",
            ]}
          />
          <TicketCard
            emoji="👬"
            name="Duo"
            seats="2 seats · 2 canvases"
            price={PRICING.duo}
            accent="from-hue-pink to-hue-yellow"
            highlight
            note={`Saves PKR ${(PRICING.single * 2 - PRICING.duo).toLocaleString(
              "en-PK"
            )} against two solo passes`}
            perks={[
              "Two canvases, side by side",
              "Jam session + all the games",
              "Free coffee for both of you",
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
            Your colour is waiting. 🎨
          </h2>
          <p className="text-rz-cream/75 mb-8">
            {EVENT.dateLabel} · {EVENT.timeLabel}. Location revealed soon —
            book now and we&apos;ll send it straight to your WhatsApp.
          </p>
          <Link href="/book" className="btn-primary text-base">
            🎟 Book Your Spot
          </Link>
        </GlassCard>
      </section>

      {/* ------------------------------------------------------------- Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-rz-cream/55">
          <p>
            <span className="font-display font-bold text-rz-cream/80">
              {EVENT.name}
            </span>{" "}
            · {EVENT.tagline} · by {EVENT.brand}
          </p>
          <a
            href={businessChatLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rz-cream transition"
          >
            💬 {EVENT.whatsappBusinessDisplay}
          </a>
        </div>
      </footer>
    </div>
  );
}
