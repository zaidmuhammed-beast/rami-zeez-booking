"use client";

import { useEffect, useRef, useState } from "react";
import type { Booking } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatPkr } from "@/lib/format";
import { getEarnedBadges } from "@/lib/badges";
import { BADGES } from "@/lib/constants";
import { wristbandFor } from "@/lib/wristband";

const READER_ID = "rz-qr-reader";

export function CheckinScanner() {
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [manualRef, setManualRef] = useState("");
  const [checkinError, setCheckinError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode(READER_ID);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 240 },
          (decodedText) => {
            if (!isPausedRef.current) {
              isPausedRef.current = true;
              lookupRef(decodedText);
            }
          },
          () => {}
        );
      } catch {
        setCameraError(
          "Camera unavailable. Grant camera access or use manual entry below."
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
  }, []);

  async function lookupRef(ref: string) {
    setBusy(true);
    setLookupError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${ref.toUpperCase().trim()}`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data.error || "Booking not found.");
        setBooking(null);
        return;
      }
      setBooking(data.booking);
    } catch {
      setLookupError("Network error looking up booking.");
    } finally {
      setBusy(false);
    }
  }

  async function markCheckedIn() {
    if (!booking) return;
    setBusy(true);
    setCheckinError(null);
    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: booking.booking_ref }),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
      } else {
        setCheckinError(data.error || "Couldn't check in this booking.");
      }
    } finally {
      setBusy(false);
    }
  }

  function scanNext() {
    setBooking(null);
    setLookupError(null);
    setCheckinError(null);
    isPausedRef.current = false;
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">Check-in Scanner</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        Scan a guest&apos;s QR code from their confirmation page.
      </p>

      {!booking && (
        <GlassCard className="p-4 mb-4">
          <div
            id={READER_ID}
            className="rounded-2xl overflow-hidden bg-black/30 min-h-[260px]"
          />
          {cameraError && (
            <p className="mt-3 text-sm text-amber-300">{cameraError}</p>
          )}
        </GlassCard>
      )}

      {!booking && (
        <GlassCard className="p-4 mb-4">
          <label className="block text-sm mb-2 text-rz-cream/70">
            Or enter booking ref manually
          </label>
          <div className="flex gap-2">
            <input
              className="input-glass"
              placeholder="RZ-XXXXXX"
              value={manualRef}
              onChange={(e) => setManualRef(e.target.value)}
            />
            <button
              onClick={() => manualRef && lookupRef(manualRef)}
              disabled={busy || !manualRef}
              className="btn-ghost px-5 disabled:opacity-50"
            >
              Look up
            </button>
          </div>
          {lookupError && (
            <p className="mt-2 text-xs text-rose-300">{lookupError}</p>
          )}
        </GlassCard>
      )}

      {booking && (
        <GlassCard strong className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-lg font-bold">{booking.primary_name}</p>
              <p className="text-xs text-rz-cream/50">{booking.booking_ref}</p>
            </div>
            <span
              className={`chip ${
                booking.status !== "pending_payment"
                  ? "border-emerald-400/40 text-emerald-300"
                  : "border-amber-400/40 text-amber-300"
              }`}
            >
              {booking.status !== "pending_payment" ? "✅ Paid" : "⏳ Pending"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            <div className="glass rounded-xl p-3">
              <p className="text-rz-cream/50">Ticket</p>
              <p className="font-semibold">{booking.ticket_type}</p>
              <p className="text-xs text-rz-cream/50">{formatPkr(booking.amount)}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-rz-cream/50">☕ Coffee</p>
              <p className="font-semibold">
                {booking.coffee_claimed ? "Claimed" : "Not yet"}
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-rz-cream/50">Quiz Number</p>
              <p className="font-semibold">
                {booking.quiz_number != null ? `#${booking.quiz_number}` : "Assign on check-in"}
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-rz-cream/50">Table</p>
              <p className="font-semibold">{booking.table_number || "Assign on check-in"}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-rz-cream/50">Wristband</p>
              <p className="font-semibold flex items-center gap-1.5">
                {booking.wristband_color && (
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: wristbandFor(booking.group_type).hex }}
                  />
                )}
                {booking.wristband_color || "Assign on check-in"}
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-rz-cream/50">🎟 Lucky Draw</p>
              <p className="font-semibold">{booking.lucky_draw_token || "Assign on check-in"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {getEarnedBadges(booking).map((k) => (
              <span key={k} className="chip">
                {BADGES[k].emoji} {BADGES[k].label}
              </span>
            ))}
          </div>

          {booking.status === "checked_in" ? (
            <div className="text-center py-2 text-emerald-300 font-semibold mb-4">
              ✅ Already Checked In
            </div>
          ) : booking.status === "pending_payment" ? (
            <div className="mb-3">
              <p className="text-center text-sm text-amber-300 mb-3">
                ⚠️ Not marked Paid yet — verify their payment screenshot in the
                dashboard before letting them in.
              </p>
              <button disabled className="btn-primary w-full opacity-40 cursor-not-allowed">
                ✅ Mark Checked In
              </button>
            </div>
          ) : (
            <button
              onClick={markCheckedIn}
              disabled={busy}
              className="btn-primary w-full mb-3 disabled:opacity-60"
            >
              {busy ? "Checking in..." : "✅ Mark Checked In"}
            </button>
          )}

          {checkinError && (
            <p className="text-center text-xs text-rose-300 mb-3">{checkinError}</p>
          )}

          <button onClick={scanNext} className="btn-ghost w-full">
            Scan Next Guest
          </button>
        </GlassCard>
      )}
    </div>
  );
}
