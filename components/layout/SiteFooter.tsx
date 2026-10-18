import Link from "next/link";
import { EVENT } from "@/lib/constants";
import { upcomingEvents } from "@/lib/events";
import { businessChatLink } from "@/lib/whatsapp";

export function SiteFooter() {
  // Name whatever is next rather than an event that has already run.
  const next = upcomingEvents()[0];

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-rz-cream/55">
        <p className="text-center sm:text-left">
          <span className="font-display font-bold text-rz-cream/80">
            {EVENT.brand}
          </span>
          {next ? ` · Next up: ${next.name}` : ""}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/" className="hover:text-rz-cream transition">
            Home
          </Link>
          <Link href="/events" className="hover:text-rz-cream transition">
            Upcoming Events
          </Link>
          <Link href="/about" className="hover:text-rz-cream transition">
            About
          </Link>
          <Link href="/revolution" className="hover:text-rz-cream transition">
            Revolution
          </Link>
          <Link href="/brands" className="hover:text-rz-cream transition">
            For Brands
          </Link>
          <Link href="/ambassadors" className="hover:text-rz-cream transition">
            Ambassadors
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
