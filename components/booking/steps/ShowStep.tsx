"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BookingFormValues } from "@/lib/booking-schema";
import { EVENT, SHOW_TIMES } from "@/lib/constants";
import type { ShowAvailability } from "@/lib/slots";

type ShowStepProps = {
  form: UseFormReturn<BookingFormValues>;
  onNext: () => void;
};

export function ShowStep({ form, onNext }: ShowStepProps) {
  const { control, setValue } = form;
  const picked = useWatch({ control, name: "show_time" });
  const [shows, setShows] = useState<ShowAvailability[] | null>(null);

  // Live seat counts, so a sold-out show can't be picked.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/slots")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.shows)) setShows(data.shows);
      })
      .catch(() => {
        /* Counts are a nicety — the server re-checks on submit. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pickedShow = shows?.find((s) => s.id === picked);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Which show?
      </h2>
      <p className="text-center text-rz-cream/70 mb-6">
        {EVENT.dateLabel} · {EVENT.locationLabel}. Two films — pick your show.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SHOW_TIMES.map((show) => {
          const live = shows?.find((s) => s.id === show.id);
          const soldOut = live?.soldOut ?? false;
          const selected = picked === show.id;

          return (
            <button
              key={show.id}
              type="button"
              disabled={soldOut}
              onClick={() =>
                setValue("show_time", show.id, { shouldValidate: true })
              }
              className={`glass rounded-2xl px-4 py-6 flex flex-col items-center gap-1.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${
                selected
                  ? "border-rz-amber-400/70 bg-white/15 ring-1 ring-rz-amber-400/50"
                  : "hover:-translate-y-1 hover:bg-white/15"
              }`}
            >
              <span className="text-3xl">{show.emoji}</span>
              <span className="font-display text-lg font-bold leading-tight">
                {show.film}
              </span>
              <span className="font-display text-xl font-extrabold text-rz-amber-400">
                {show.label}
              </span>
              <span className="text-xs text-rz-cream/60">{show.note}</span>

              {live ? (
                <span
                  className={`mt-2 chip text-xs ${
                    soldOut
                      ? "text-rz-cream/50"
                      : live.remaining <= 5
                      ? "border-rz-amber-400/40 text-rz-amber-400"
                      : "text-rz-cream/70"
                  }`}
                >
                  {soldOut
                    ? "Sold out"
                    : `${live.remaining} of ${live.capacity} seats left`}
                </span>
              ) : (
                <span className="mt-2 chip text-xs text-rz-cream/40">
                  Checking seats…
                </span>
              )}
            </button>
          );
        })}
      </div>

      {pickedShow && !pickedShow.soldOut && pickedShow.remaining <= 5 && (
        <p className="mt-4 text-center text-sm text-rz-amber-400">
          🔥 Only {pickedShow.remaining} left for {pickedShow.film} at{" "}
          {pickedShow.label}.
        </p>
      )}

      <button
        type="button"
        disabled={!picked}
        onClick={onNext}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
