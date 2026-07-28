"use client";

import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/booking-schema";
import { PAYMENT_METHODS } from "@/lib/constants";
import { PAYMENT_ACCOUNTS } from "@/lib/payment-config";
import { computeTicket } from "@/lib/pricing";
import { formatPkr } from "@/lib/format";

type PaymentStepProps = {
  form: UseFormReturn<BookingFormValues>;
  screenshot: File | null;
  onScreenshotChange: (file: File | null) => void;
  screenshotError: string | null;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
};

export function PaymentStep({
  form,
  screenshot,
  onScreenshotChange,
  screenshotError,
  onSubmit,
  isSubmitting,
  submitError,
}: PaymentStepProps) {
  const { watch, setValue } = form;
  const groupType = watch("group_type");
  const numParticipants = watch("num_participants");
  const paymentMethod = watch("payment_method");
  const ticket = computeTicket(groupType, numParticipants || 1);
  const account = paymentMethod ? PAYMENT_ACCOUNTS[paymentMethod] : null;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Almost there 💳
      </h2>
      <p className="text-center text-rz-cream/70 mb-6">
        Pay, upload your screenshot, and you&apos;re in the Mehfil.
      </p>

      <div className="glass-strong rounded-2xl p-4 flex items-center justify-between mb-6">
        <span className="font-semibold">{ticket.ticketType}</span>
        <span className="font-display text-lg font-bold text-rz-amber-400">
          {formatPkr(ticket.amount)}
        </span>
      </div>

      <label className="block text-sm mb-2 text-rz-cream/80">
        Accepted Methods
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setValue("payment_method", m, { shouldValidate: true })}
            className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              paymentMethod === m
                ? "bg-rz-amber-400/90 text-rz-purple-950"
                : "bg-white/8 hover:bg-white/15"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {account && (
        <div className="glass rounded-2xl p-4 mb-6 text-sm">
          <p className="text-rz-cream/60 mb-1">Send payment to:</p>
          <p className="font-semibold">{account.accountTitle}</p>
          <p className="font-mono text-rz-amber-400">{account.accountNumber}</p>
          {account.extra && <p className="text-rz-cream/60 mt-1">{account.extra}</p>}
        </div>
      )}

      <label className="block text-sm mb-2 text-rz-cream/80">
        Upload Payment Screenshot
      </label>
      <label className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/15 transition text-center">
        <span className="text-2xl">📎</span>
        <span className="text-sm text-rz-cream/75">
          {screenshot ? screenshot.name : "Tap to upload screenshot"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onScreenshotChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {screenshotError && (
        <p className="mt-1 text-xs text-rose-300">{screenshotError}</p>
      )}

      {submitError && (
        <p className="mt-4 text-sm text-rose-300 text-center">{submitError}</p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="btn-primary w-full mt-8 disabled:opacity-60"
      >
        {isSubmitting ? "Confirming your spot..." : "🎉 Complete Registration"}
      </button>
    </div>
  );
}
