import Link from "next/link";
import { EVENT } from "@/lib/constants";
import { businessChatLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-rz-cream/55">
        <p className="text-center sm:text-left">
          <span className="font-display font-bold text-rz-cream/80">
            {EVENT.name}
          </span>{" "}
          · {EVENT.tagline} · by {EVENT.brand}
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/" className="hover:text-rz-cream transition">
            Home
          </Link>
          <Link href="/events" className="hover:text-rz-cream transition">
            Upcoming Events
          </Link>
          <a
            href={businessChatLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rz-cream transition"
          >
            💬 {EVENT.whatsappBusinessDisplay}
          </a>
        </nav>
      </div>
    </footer>
  );
}
