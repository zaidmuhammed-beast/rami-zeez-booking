"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@/lib/types";
import { FUN_QUESTIONS } from "@/lib/constants";
import { formatPkr } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";

type BookingDetailModalProps = {
  booking: Booking;
  onClose: () => void;
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-rz-cream/50">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [loadingScreenshot, setLoadingScreenshot] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/admin/bookings/${booking.booking_ref}/screenshot`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.url) setScreenshotUrl(data.url);
        else setScreenshotError(data.error || "No screenshot available.");
      })
      .catch(() => {
        if (!cancelled) setScreenshotError("Couldn't load screenshot.");
      })
      .finally(() => {
        if (!cancelled) setLoadingScreenshot(false);
      });

    return () => {
      cancelled = true;
    };
  }, [booking.booking_ref]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <GlassCard
        strong
        className="w-full max-w-2xl p-6 sm:p-8 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold">{booking.primary_name}</h2>
            <p className="text-sm text-rz-cream/50">
              {booking.booking_ref} · {booking.ticket_type} · {formatPkr(booking.amount)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="font-semibold mb-3">Primary Contact</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Full Name" value={booking.primary_name} />
              <Field label="Age" value={booking.primary_age} />
              <Field label="Phone" value={booking.primary_phone} />
              <Field label="WhatsApp" value={booking.primary_whatsapp} />
              <Field label="Instagram" value={booking.primary_instagram} />
              <Field label="Group Type" value={booking.group_type} />
              <Field label="Participants" value={booking.num_participants} />
            </div>
          </div>

          {booking.group_type === "couple" && (
            <div>
              <p className="font-semibold mb-3">❤️ Partner</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Partner Name" value={booking.partner_name} />
                <Field label="Partner Phone" value={booking.partner_phone} />
                <Field label="Partner Instagram" value={booking.partner_instagram} />
                <Field label="Together For" value={booking.relationship_duration} />
              </div>
            </div>
          )}

          {booking.group_type === "duo" && (
            <div>
              <p className="font-semibold mb-3">👬 Buddy</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Full Name" value={booking.buddy_name} />
                <Field label="Age" value={booking.buddy_age} />
                <Field label="Phone" value={booking.buddy_phone} />
                <Field label="WhatsApp" value={booking.buddy_whatsapp} />
                <Field label="Instagram" value={booking.buddy_instagram} />
              </div>
            </div>
          )}

          {Object.keys(booking.fun_answers || {}).length > 0 && (
            <div>
              <p className="font-semibold mb-3">🎲 Fun Answers</p>
              <div className="space-y-2 text-sm">
                {FUN_QUESTIONS.map((q) => {
                  const answer = booking.fun_answers?.[q.key];
                  if (!answer) return null;
                  return (
                    <div key={q.key} className="flex justify-between gap-4">
                      <span className="text-rz-cream/60">
                        {q.emoji} {q.label}
                      </span>
                      <span className="font-medium text-right">{answer}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="font-semibold mb-3">💳 Payment</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <Field label="Method" value={booking.payment_method} />
              <Field
                label="Submitted"
                value={new Date(booking.created_at).toLocaleString()}
              />
            </div>
            {loadingScreenshot && (
              <p className="text-sm text-rz-cream/50">Loading screenshot...</p>
            )}
            {screenshotError && (
              <p className="text-sm text-rz-cream/50">{screenshotError}</p>
            )}
            {screenshotUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={screenshotUrl}
                alt="Payment screenshot"
                className="rounded-2xl border border-white/15 max-h-96 w-auto"
              />
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
