import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BrandForm } from "@/components/brands/BrandForm";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Partner With Us — ${EVENT.brand}`,
  description: `Get a stall or promote your brand at ${EVENT.brand} events. Tell us about your product or service and we'll come back with options.`,
};

const WHY = [
  {
    emoji: "🎯",
    title: "A room that's already engaged",
    description:
      "Small, curated crowds who came to do something together — not scroll past a banner.",
    accent: "from-hue-pink to-hue-coral",
  },
  {
    emoji: "🏪",
    title: "Your own corner",
    description:
      "Set up a stall, sample your product, and talk to every guest who walks through.",
    accent: "from-hue-yellow to-hue-coral",
  },
  {
    emoji: "📣",
    title: "Built into the event",
    description:
      "Branding across the space, our socials and the run of show — not just a logo on a poster.",
    accent: "from-hue-mint to-hue-sky",
  },
];

export default function BrandsPage() {
  return (
    <div className="flex-1">
      <SiteHeader />

      {/* ------------------------------------------------------------- Header */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-10 md:pt-20 md:pb-12 text-center">
          <span className="chip mb-6">🤝 {EVENT.brand} · For brands</span>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl">
            <span className="hue-text">Partner</span>{" "}
            <span className="hue-text-cool">With Us</span>
          </h1>
          <span
            aria-hidden
            className="animate-brush-in mt-4 mx-auto block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint"
          />
          <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto">
            Want a stall at our events, or your brand in front of the room? Fill
            in your details below and we&apos;ll come back with options, pricing
            and the next available date.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Why */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {WHY.map((item) => (
            <GlassCard
              key={item.title}
              className="relative overflow-hidden p-6 flex flex-col items-start gap-3"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`}
              />
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${item.accent} text-2xl shadow-lg shadow-purple-950/40`}
              >
                {item.emoji}
              </span>
              <h2 className="font-display text-base font-bold">{item.title}</h2>
              <p className="text-sm text-rz-cream/75 leading-relaxed">
                {item.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Form */}
      <section className="mx-auto max-w-3xl px-6 pb-10">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-2">
          Tell us about your brand
        </h2>
        <p className="text-center text-rz-cream/70 mb-8">
          Takes a minute — every field is required, so we can quote you properly.
        </p>
        <BrandForm />
      </section>

      {/* ------------------------------------------------------------ Rather chat */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold">Rather just talk it through?</p>
            <p className="text-sm text-rz-cream/70 mt-1">
              Message us and we&apos;ll answer on WhatsApp — {EVENT.whatsappBusinessDisplay}
            </p>
          </div>
          <a
            href={businessChatLink(
              `Hi ${EVENT.brand}! I'd like to know about stalls and promotion at your events 🤝`
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
