"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENT } from "@/lib/constants";
import { upcomingEvents } from "@/lib/events";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/brands", label: "For Brands" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // No live event means no Book CTA — /book has nothing to sell.
  const onSale = upcomingEvents().some((e) => e.status === "booking_open");

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="glass border-x-0 border-t-0 sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-display font-extrabold tracking-tight">
          <span className="hue-text">{EVENT.brand}</span>
        </Link>

        {/* ------------------------------------------------------- Desktop */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 transition ${
                isActive(link.href)
                  ? "bg-white/15 text-rz-cream font-semibold"
                  : "text-rz-cream/70 hover:bg-white/10 hover:text-rz-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {onSale && (
            <Link href="/book" className="btn-primary ml-2 px-5 py-2 text-sm">
              🎟 Book
            </Link>
          )}
        </nav>

        {/* -------------------------------------------------------- Mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden rounded-full border border-white/20 bg-white/10 px-3 py-2 text-lg leading-none"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <nav
        id="site-menu"
        hidden={!open}
        className="md:hidden border-t border-white/10 px-5 pb-4 pt-2"
      >
        <div className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-2xl px-4 py-3 transition ${
                isActive(link.href)
                  ? "bg-white/15 text-rz-cream font-semibold"
                  : "text-rz-cream/75 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {onSale && (
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              🎟 Book Your Spot
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
