import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { SlotProgress } from "@/components/ui/SlotProgress";
import { HighlightCard } from "@/components/landing/HighlightCard";
import { getSlotAvailability } from "@/lib/slots";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

// Keep the slot counter reasonably live without hitting Supabase on every visit.
export const revalidate = 30;

const HIGHLIGHTS = [
  {
    emoji: "❤️",
    title: "Couple Quiz",
    description: "How well do you actually know each other? Let's find out — live, on stage.",
  },
  {
    emoji: "🎸",
    title: "Jam with Mic Droppers",
    description: "Live music, open mic energy, and singalongs with the crew.",
  },
  {
    emoji: "☕",
    title: "Free Coffee",
    description: "Every pass comes with a coffee on us. Non-negotiable.",
  },
  {
    emoji: "🎨",
    title: "Creative Activities",
    description: "Hands-on, playful, and made for making new friends.",
  },
  {
    emoji: "📸",
    title: "Photo Moments",
    description: "A photo wall built for your feed and your memories.",
  },
];

export default async function Home() {
  const { taken, total } = await getSlotAvailability();

  return (
    <div className="flex-1">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="chip mb-6">💜 {EVENT.dateLabel} · The Mehfil</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Ready to experience your inner{" "}
              <span className="bg-gradient-to-r from-rz-amber-400 to-rz-amber-500 bg-clip-text text-transparent">
                Harami Soul?
              </span>{" "}
              👀
            </h1>
            <p className="mt-6 text-lg text-rz-cream/80 max-w-xl mx-auto md:mx-0">
              We&apos;re not just hosting events. We&apos;re building stories,
              friendships, and unforgettable memories.
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
                💬 Have Questions? Chat on WhatsApp
              </a>
            </div>
            <p className="mt-3 text-sm text-rz-cream/60">
              {EVENT.whatsappBusinessDisplay}
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <Mascot size={280} float priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <GlassCard className="p-5 sm:p-6 max-w-md mx-auto">
          <SlotProgress taken={taken} total={total} />
        </GlassCard>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">
          What&apos;s Waiting For You
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HIGHLIGHTS.map((h) => (
            <HighlightCard key={h.title} {...h} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <GlassCard strong className="p-8 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Every click builds the excitement. 🎉
          </h2>
          <p className="text-rz-cream/75 mb-8">
            Discover, choose, laugh, book, and arrive already feeling like
            part of the Mehfil.
          </p>
          <Link href="/book" className="btn-primary text-base">
            🎟 Book Your Spot
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
