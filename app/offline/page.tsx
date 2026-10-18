import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mascot } from "@/components/ui/Mascot";
import { EVENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Offline — ${EVENT.brand}`,
};

export default function OfflinePage() {
  return (
    <div className="flex-1 mx-auto max-w-lg px-6 py-20 text-center">
      <div className="flex justify-center mb-6">
        <Mascot size={160} className="w-32 h-auto" />
      </div>
      <GlassCard strong className="relative overflow-hidden p-8">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-sky"
        />
        <span className="text-4xl">📡</span>
        <h1 className="font-display text-2xl font-bold mt-3">
          You&apos;re offline
        </h1>
        <p className="mt-3 text-rz-cream/75">
          No connection right now. Pages you&apos;ve already opened still work
          — seat counts and bookings need you back online.
        </p>
        <Link href="/" className="btn-primary mt-7">
          🔄 Try again
        </Link>
      </GlassCard>
    </div>
  );
}
