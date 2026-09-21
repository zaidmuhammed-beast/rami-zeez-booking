import Link from "next/link";
import { PaintBackdrop } from "@/components/landing/PaintBackdrop";
import { CookingScene } from "@/components/landing/CookingScene";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

/**
 * The between-events hero. Shown whenever nothing is on sale, so the page
 * never advertises an event that has already happened.
 */
export function CookingHero() {
  return (
    <section className="relative overflow-hidden">
      <PaintBackdrop />

      <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-12 md:pt-20 md:pb-16 grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div className="text-center md:text-left">
          <span className="chip mb-6">👨‍🍳 {EVENT.brand} · In the kitchen</span>

          <h1 className="font-display font-extrabold leading-[1.02] tracking-tight text-4xl sm:text-5xl md:text-6xl">
            <span className="hue-text-shimmer">Cooking Something</span>
            <br />
            <span className="text-rz-cream/90">For You</span>
          </h1>

          <span
            aria-hidden
            className="animate-brush-in mt-4 block h-1.5 w-40 rounded-full bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint mx-auto md:mx-0"
          />

          <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto md:mx-0">
            The next one&apos;s on the stove. A screening, live theatre, Basant,
            a wedding special — all simmering away. Dates drop here first.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/events" className="btn-primary text-base">
              📅 See what&apos;s coming
            </Link>
            <a
              href={businessChatLink(
                `Hi ${EVENT.brand}! Let me know when your next event drops 🔔`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-base"
            >
              🔔 Tell me first
            </a>
          </div>
          <p className="mt-3 text-sm text-rz-cream/60">
            {EVENT.whatsappBusinessDisplay}
          </p>
        </div>

        <CookingScene />
      </div>
    </section>
  );
}
