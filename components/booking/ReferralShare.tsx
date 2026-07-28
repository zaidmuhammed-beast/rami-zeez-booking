"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type ReferralShareProps = {
  link: string;
};

export function ReferralShare({ link }: ReferralShareProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const shareText = `Come to the Rami ZeeZ Mehfil with me! 🎉 Book your spot here: ${link}`;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <GlassCard className="p-6 mb-6">
      <p className="font-semibold mb-1">Invite 2 friends and get:</p>
      <ul className="text-sm text-rz-cream/80 space-y-1 mb-4">
        <li>🍹 Free Mocktail</li>
        <li>👑 VIP Seating</li>
        <li>🎁 Merchandise Discount</li>
        <li>🎟 Extra Lucky Draw Entry</li>
      </ul>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          readOnly
          value={link}
          className="input-glass text-xs sm:text-sm"
          onFocus={(e) => e.target.select()}
        />
        <button type="button" onClick={copyLink} className="btn-ghost shrink-0 px-5">
          {copied ? "✅ Copied" : "📋 Copy"}
        </button>
      </div>
      <a
        href={shareHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full mt-3"
      >
        💬 Share on WhatsApp
      </a>
    </GlassCard>
  );
}
