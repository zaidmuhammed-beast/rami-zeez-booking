"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/checkin", label: "Check-in" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/ambassadors", label: "Ambassadors" },
  { href: "/admin/revolution", label: "Revolution" },
  { href: "/admin/health", label: "Health" },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const current = LINKS.find((l) => isActive(l.href));

  return (
    <header className="glass border-x-0 border-t-0 sticky top-0 z-20">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-display font-bold whitespace-nowrap">
            <span className="sm:hidden">RZ Admin</span>
            <span className="hidden sm:inline">Rami ZeeZ Admin</span>
          </span>

          {/* -------------------------------------------------- Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition ${
                  isActive(link.href)
                    ? "bg-white/15 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="lg:hidden text-sm text-rz-cream/60 truncate max-w-28">
            {current?.label}
          </span>
          <div className="hidden lg:block">
            <LogoutButton />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="lg:hidden rounded-full border border-white/20 bg-white/10 px-3 py-2 text-lg leading-none"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------- Mobile nav */}
      <nav
        id="admin-menu"
        hidden={!open}
        className="lg:hidden border-t border-white/10 px-4 pb-4 pt-2"
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
                  ? "bg-white/15 font-semibold"
                  : "text-rz-cream/75 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-white/10 pt-3 px-1">
            <LogoutButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
