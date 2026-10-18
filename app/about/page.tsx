import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { EventTile } from "@/components/events/EventTile";
import { EVENT } from "@/lib/constants";
import { MOVEMENT, PILLARS, CONTRIBUTIONS } from "@/lib/movement";
import { pastEvents, upcomingEvents } from "@/lib/events";
import { businessChatLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `About — ${EVENT.brand} × ${MOVEMENT.name}`,
  description: `${EVENT.brand} is a non-profit events community. Every room we fill funds ${MOVEMENT.name} — legal aid for women denied justice, and the tools for them to earn their own living.`,
};

export default function AboutPage() {
  const past = pastEvents();
  const next = upcomingEvents()[0];

  return (
    <div className="flex-1">
      <SiteHeader />

      {/* ------------------------------------------------------------- Header */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-10 md:pt-20 md:pb-12 text-center">
          <span className="chip mb-6">🤲 Who we are</span>

          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl">
            <span className="hue-text">{EVENT.brand}</span>
            <span className="text-rz-cream/40"> × </span>
            <span className="hue-text-cool">{MOVEMENT.name}</span>
          </h1>

          <p className="mt-4 font-display text-lg sm:text-xl font-bold text-rz-cream/85">
            Ashraf-ul-Makhluqat — {MOVEMENT.meaning}.
          </p>
          <span
            aria-hidden
            className="animate-brush-in mt-4 mx-auto block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint"
          />

          <p className="mt-6 text-lg text-rz-cream/80 max-w-2xl mx-auto">
            If people really are the best of creation, then how we treat the
            people with the least power is the whole test. That idea is why we
            throw events — and what every room we fill is for.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- Rami ZeeZ */}
      <section className="mx-auto max-w-4xl px-6 pb-10">
        <GlassCard strong className="relative overflow-hidden p-7 sm:p-9">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-sky"
          />
          <h2 className="font-display text-2xl font-bold">
            Pakistan&apos;s first non-profit events community
          </h2>
          <p className="mt-4 text-rz-cream/80 leading-relaxed">
            {`${EVENT.brand} started as a way to get people into the same room — painting, playing, watching, jamming. None of it is run for profit. What a ticket pays for is the room, and what's left over goes to people who are struggling.`}
          </p>
          <p className="mt-4 text-rz-cream/80 leading-relaxed">
            That is the shift: a community that was already good at gathering
            people, pointed at something that needs exactly that — numbers,
            attention and money, consistently, for people who have none of the
            three.
          </p>
        </GlassCard>
      </section>

      {/* --------------------------------------------------------- The movement */}
      <section className="mx-auto max-w-4xl px-6 py-6">
        <GlassCard className="relative overflow-hidden p-7 sm:p-9">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hue-sky to-hue-mint"
          />
          <p className="text-xs uppercase tracking-[0.2em] text-rz-cream/50">
            The movement
          </p>
          <blockquote className="mt-4 font-display text-xl sm:text-2xl font-bold leading-snug text-rz-cream/90">
            &ldquo;{MOVEMENT.statement}&rdquo;
          </blockquote>
          <p className="mt-5 text-rz-cream/75 leading-relaxed">
            {`${MOVEMENT.name} is about women's safety, justice and independence in Pakistan. Not slogans, and not for a news cycle — two concrete things, done for as long as they take.`}
          </p>
        </GlassCard>
      </section>

      {/* ------------------------------------------------------------ Pillars */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid md:grid-cols-2 gap-5">
          {PILLARS.map((pillar) => (
            <GlassCard
              key={pillar.title}
              className="relative overflow-hidden p-7 flex flex-col"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${pillar.accent}`}
              />
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${pillar.accent} text-2xl shadow-lg shadow-purple-950/40`}
              >
                {pillar.emoji}
              </span>
              <h3 className="font-display text-xl font-bold mt-4">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm text-rz-cream/75 leading-relaxed">
                {pillar.description}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-rz-cream/80">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="text-hue-mint">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- How an event helps */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-5">
          How a night out turns into help
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "We fill a room",
              body: "A screening, a paint night, a jam. You come for the evening and meet people worth knowing.",
            },
            {
              step: "02",
              title: "The room funds the work",
              body: "Nothing is run for profit. What a ticket covers beyond costs goes into legal aid and startup tools.",
            },
            {
              step: "03",
              title: "Someone stops standing alone",
              body: "A case gets filed. A cart gets bought. A woman earns her own income instead of asking for one.",
            },
          ].map((item) => (
            <GlassCard key={item.step} className="p-6">
              <span className="font-display text-3xl font-extrabold hue-text">
                {item.step}
              </span>
              <h3 className="font-display text-lg font-bold mt-2">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-rz-cream/75 leading-relaxed">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- Pledge */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <GlassCard strong className="relative overflow-hidden p-7 sm:p-9">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-yellow via-hue-coral to-hue-pink"
          />
          <p className="text-xs uppercase tracking-[0.2em] text-rz-cream/50">
            The pledge every member takes
          </p>
          <blockquote className="mt-4 text-lg leading-relaxed text-rz-cream/85">
            &ldquo;{MOVEMENT.pledge}&rdquo;
          </blockquote>
        </GlassCard>
      </section>

      {/* ---------------------------------------------------------- Join in */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Where people help
        </h2>
        <p className="mt-3 text-center text-rz-cream/70 max-w-xl mx-auto">
          Members come in as lawyers, students, officers, teachers and parents.
          Whatever you have — time, a platform, a skill, a spare afternoon —
          there is a use for it.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {CONTRIBUTIONS.map((item) => (
            <span key={item} className="chip text-sm">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link href="/revolution" className="btn-primary text-base">
            ✊ Become Part Of Revolution
          </Link>
          <p className="text-sm text-rz-cream/65 max-w-md">
            Ask for startup support — a cart, tools, materials, training — or
            offer it. Open to anyone who needs a start.
          </p>
          <a
            href={MOVEMENT.joinFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-rz-cream/70 underline underline-offset-4 decoration-white/25 hover:text-rz-cream transition"
          >
            Or apply to the justice team →
          </a>
        </div>
      </section>

      {/* ------------------------------------------------------- What we've run */}
      {past.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-5">
            Rooms we&apos;ve filled
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map((event) => (
              <EventTile key={event.slug} event={event} past />
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- Final CTA */}
      <section className="mx-auto max-w-3xl px-6 py-10 pb-16 text-center">
        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between text-left">
          <div>
            <p className="font-semibold">
              {next ? `Next up: ${next.name}` : "Come to the next one"}
            </p>
            <p className="text-sm text-rz-cream/70 mt-1">
              The simplest way to help is to turn up — or ask us anything on
              WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/events" className="btn-ghost">
              📅 Events
            </Link>
            <a
              href={businessChatLink(
                `Hi ${EVENT.brand}! I'd like to know more about ${MOVEMENT.name} 🤲`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              💬 WhatsApp
            </a>
          </div>
        </GlassCard>
      </section>

      <SiteFooter />
    </div>
  );
}
