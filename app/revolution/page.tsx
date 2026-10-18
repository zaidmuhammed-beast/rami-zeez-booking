import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RevolutionForm } from "@/components/revolution/RevolutionForm";
import { EVENT } from "@/lib/constants";
import { MOVEMENT } from "@/lib/movement";
import { businessChatLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Become Part Of Revolution — ${EVENT.brand}`,
  description: `Apply for startup support — a cart, tools, materials or training — or offer it. ${MOVEMENT.name} backs anyone who needs a start, whoever they are.`,
};

const PROMISE = [
  {
    emoji: "🛒",
    title: "Tools, not handouts",
    description:
      "A cart, a sewing machine, an oven, a repair kit, materials for daily work — whatever turns effort into income.",
    accent: "from-hue-pink to-hue-coral",
  },
  {
    emoji: "🙌",
    title: "Anyone who needs a start",
    description:
      "Any age, any gender, any trade. If you're struggling and willing to work, this programme is for you.",
    accent: "from-hue-yellow to-hue-coral",
  },
  {
    emoji: "🔒",
    title: "Read by the core team only",
    description:
      "What you write about your situation stays private. Nobody is named, listed or posted anywhere.",
    accent: "from-hue-mint to-hue-sky",
  },
];

export default function RevolutionPage() {
  return (
    <div className="flex-1">
      <SiteHeader />

      {/* ------------------------------------------------------------- Header */}
      <section className="relative overflow-hidden">
        <PaintBackdrop />

        <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-10 md:pt-20 md:pb-12 text-center">
          <span className="chip mb-6">✊ {MOVEMENT.name}</span>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl">
            <span className="hue-text">Become Part Of</span>{" "}
            <span className="hue-text-cool">Revolution</span>
          </h1>
          <span
            aria-hidden
            className="animate-brush-in mt-4 mx-auto block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint"
          />
          <p className="mt-6 text-lg text-rz-cream/80 max-w-2xl mx-auto">
            We put the means of earning into people&apos;s hands — a cart, a
            shop, tools, materials, training. If that&apos;s what stands
            between you and your own income, tell us. If you can help someone
            else get there, tell us that.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ Promise */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {PROMISE.map((item) => (
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
          Tell us where you stand
        </h2>
        <p className="text-center text-rz-cream/70 mb-8">
          The form changes depending on whether you need support, can give it,
          or both.
        </p>
        <RevolutionForm />
      </section>

      {/* -------------------------------------------------------- Rather chat */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="font-semibold">Can&apos;t fill this in right now?</p>
            <p className="text-sm text-rz-cream/70 mt-1">
              Message us and we&apos;ll take your details on WhatsApp —{" "}
              {EVENT.whatsappBusinessDisplay}
            </p>
          </div>
          <a
            href={businessChatLink(
              `Hi ${EVENT.brand}! I'd like to talk about ${MOVEMENT.name} support 🤲`
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
        <Link href="/about" className="btn-ghost">
          ← What this is all about
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
