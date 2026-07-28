"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@/lib/types";
import { adminToCustomerLink } from "@/lib/whatsapp";
import { formatPkr } from "@/lib/format";
import { getEarnedBadges } from "@/lib/badges";
import { BADGES } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";

type AdminTableProps = {
  initialBookings: Booking[];
};

export function AdminTable({ initialBookings }: AdminTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [pendingRef, setPendingRef] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.primary_name.toLowerCase().includes(q) ||
        b.booking_ref.toLowerCase().includes(q) ||
        (b.partner_name || "").toLowerCase().includes(q)
    );
  }, [bookings, search]);

  const referralCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of bookings) {
      if (b.referred_by) counts[b.referred_by] = (counts[b.referred_by] || 0) + 1;
    }
    return counts;
  }, [bookings]);

  async function patchBooking(ref: string, updates: Record<string, unknown>) {
    setPendingRef(ref);
    try {
      const res = await fetch(`/api/admin/bookings/${ref}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok && data.booking) {
        setBookings((prev) =>
          prev.map((b) => (b.booking_ref === ref ? data.booking : b))
        );
      }
    } finally {
      setPendingRef(null);
    }
  }

  function togglePaid(b: Booking) {
    const nextStatus = b.status === "pending_payment" ? "confirmed" : "pending_payment";
    patchBooking(b.booking_ref, { status: nextStatus });
  }

  function toggleCoffee(b: Booking) {
    patchBooking(b.booking_ref, { coffee_claimed: !b.coffee_claimed });
  }

  function toggleQuizChampion(b: Booking) {
    const has = b.badges?.includes("quizChampion");
    const nextBadges = has
      ? b.badges.filter((x) => x !== "quizChampion")
      : [...(b.badges || []), "quizChampion"];
    patchBooking(b.booking_ref, { badges: nextBadges });
  }

  return (
    <div>
      <input
        className="input-glass max-w-xs mb-4"
        placeholder="Search by name or ref..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm min-w-[920px]">
          <thead>
            <tr className="text-left text-rz-cream/60 border-b border-white/10">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Coffee</th>
              <th className="px-4 py-3 font-medium">Quiz</th>
              <th className="px-4 py-3 font-medium">Checked In</th>
              <th className="px-4 py-3 font-medium">Badges</th>
              <th className="px-4 py-3 font-medium">Referrals</th>
              <th className="px-4 py-3 font-medium">Send</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold">{b.primary_name}</p>
                  <p className="text-xs text-rz-cream/50">
                    {b.booking_ref}
                    {b.partner_name ? ` · ${b.partner_name}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{b.ticket_type}</p>
                  <p className="text-xs text-rz-cream/50">{formatPkr(b.amount)}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={pendingRef === b.booking_ref}
                    onClick={() => togglePaid(b)}
                    className={`chip ${
                      b.status !== "pending_payment"
                        ? "border-emerald-400/40 text-emerald-300"
                        : "border-amber-400/40 text-amber-300"
                    }`}
                  >
                    {b.status !== "pending_payment" ? "✅ Paid" : "⏳ Pending"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={pendingRef === b.booking_ref}
                    onClick={() => toggleCoffee(b)}
                    className={`chip ${
                      b.coffee_claimed
                        ? "border-emerald-400/40 text-emerald-300"
                        : ""
                    }`}
                  >
                    {b.coffee_claimed ? "☕ Claimed" : "☕ —"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {b.quiz_number != null ? `#${b.quiz_number}` : "—"}
                </td>
                <td className="px-4 py-3">
                  {b.status === "checked_in" ? (
                    <span className="chip border-emerald-400/40 text-emerald-300">
                      ✅ {b.table_number || "In"}
                    </span>
                  ) : (
                    <span className="text-rz-cream/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {getEarnedBadges(b)
                      .filter((k) => k !== "quizChampion")
                      .map((k) => (
                        <span key={k} title={BADGES[k].label} className="text-base">
                          {BADGES[k].emoji}
                        </span>
                      ))}
                    <button
                      disabled={pendingRef === b.booking_ref}
                      onClick={() => toggleQuizChampion(b)}
                      title="Toggle Quiz Champion"
                      className={`text-base ${
                        b.badges?.includes("quizChampion") ? "" : "opacity-30 grayscale"
                      }`}
                    >
                      👑
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {(() => {
                    const count = referralCounts[b.booking_ref] || 0;
                    return (
                      <span
                        className={`chip ${
                          count >= 2 ? "border-emerald-400/40 text-emerald-300" : ""
                        }`}
                      >
                        {count} {count >= 2 ? "🎁" : ""}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={adminToCustomerLink(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip hover:bg-white/15"
                  >
                    💬
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-rz-cream/50">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
