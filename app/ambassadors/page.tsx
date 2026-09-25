import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AmbassadorForm } from "@/components/ambassadors/AmbassadorForm";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Campus Ambassadors — ${EVENT.brand}`,
  description: `Represent ${EVENT.brand} at your university. Bring your campus to our events, get your own referral link, and help build what happens next.`,
};

// Placeholder perks — confirm these against the real programme terms.
const PERKS = [
  {
    emoji: "🔗",
    title: "Your own referral link",
    description:
      "Every booking made through your link is tracked to you automatically.",
    accent: "from-hue-pink to-hue-coral",
  },
  {
    emoji: "🎟",
    title: "First access to events",
    description:
      "You hear dates, venues and passes before anyone else on campus does.",
    accent: "from-hue-yellow to-hue-coral",
  },
  {
    emoji: "🎤",
    title: "A say in what we run",
    description:
      "Tell us what your campus actually wants and help shape the next one.",
    accent: "from-hue-mint to-hue-sky",
  },
  {
    emoji: "🤝",
    title: "The crew behind it",
    description:
      "Work alongside the team running the events, not from the sidelines.",
    accent: "from-hue-sky to-rz-purple-400",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Apply",
    description: "Fill the form below. Takes about two minutes.",
  },
  {
    step: "02",
    title: "We call you",
    description:
      "If you look like a fit, we message you on WhatsApp for a quick chat.",
  },
  {
    step: "03",
    title: "You're in",
    description:
      "You get your referral link, the brief for the next event, and the group chat.",
  },
];

export default function AmbassadorsPage() {
  return (
    <div className="flex-1">
      <SiteHeader />

      {/* ------------------------------------------------------------- Header */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-10 md:pt-20 md:pb-12 text-center">
          <span className="chip mb-6">🎓 {EVENT.brand} · Campus crew</span>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl">
            <span className="hue-text">Campus</span>{" "}
            <span className="hue-text-cool">Ambassadors</span>
          </h1>
          <span
            aria-hidden
            className="animate-brush-in mt-4 mx-auto block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint"
          />
          <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto">
            Know everyone worth knowing at your university? Bring them along.
            Ambassadors get our events onto their campus first — and get the
            credit for every seat they fill.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- Perks */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map((perk) => (
            <GlassCard
              key={perk.title}
              className="relative overflow-hidden p-6 flex flex-col items-start gap-3"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${perk.accent}`}
              />
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${perk.accent} text-2xl shadow-lg shadow-purple-950/40`}
              >
                {perk.emoji}
              </span>
              <h2 className="font-display text-base font-bold">{perk.title}</h2>
              <p className="text-sm text-rz-cream/75 leading-relaxed">
                {perk.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- How it works */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-sm uppercase tracking-[0.2em] text-rz-cream/50 mb-5">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((item) => (
            <GlassCard key={item.step} className="p-6">
              <span className="font-display text-3xl font-extrabold hue-text">
                {item.step}
              </span>
              <h3 className="font-display text-lg font-bold mt-2">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-rz-cream/75 leading-relaxed">
                {item.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Form */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-2">
          Apply for your campus
        </h2>
        <p className="text-center text-rz-cream/70 mb-8">
          Takes a minute — every field is required, so we get the full picture.
        </p>
        <AmbassadorForm />
      </section>

      {/* -------------------------------------------------------- Rather chat */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold">Questions before you apply?</p>
            <p className="text-sm text-rz-cream/70 mt-1">
              Message us and we&apos;ll answer on WhatsApp — {EVENT.whatsappBusinessDisplay}
            </p>
          </div>
          <a
            href={businessChatLink(
              `Hi ${EVENT.brand}! I'd like to know about the campus ambassador programme 🎓`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0"
          >
            💬 Chat on WhatsApp
          </a>
        </GlassCard>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <Link href="/events" className="btn-ghost">
          📅 See our upcoming events
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
