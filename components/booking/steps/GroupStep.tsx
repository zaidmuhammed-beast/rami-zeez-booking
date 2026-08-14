"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/booking-schema";
import { GROUP_MEME, type GroupType } from "@/lib/constants";
import { computeTicket } from "@/lib/pricing";
import { formatPkr } from "@/lib/format";
import { Stepper } from "@/components/ui/Stepper";

const OPTIONS: { type: GroupType; emoji: string; label: string }[] = [
  { type: "single", emoji: "👤", label: "Just Me" },
  { type: "duo", emoji: "👬", label: "Duo Friends" },
  { type: "couple", emoji: "❤️", label: "Couple" },
];

type GroupStepProps = {
  form: UseFormReturn<BookingFormValues>;
  onNext: () => void;
};

export function GroupStep({ form, onNext }: GroupStepProps) {
  const { watch, setValue } = form;
  const groupType = watch("group_type");
  const numParticipants = watch("num_participants");
  const [revealed, setRevealed] = useState(Boolean(groupType));

  function selectGroup(type: GroupType) {
    setValue("group_type", type, { shouldValidate: true });
    setValue("num_participants", type === "duo" ? 2 : type === "couple" ? 2 : 1, {
      shouldValidate: true,
    });
    setRevealed(true);
  }

  const meme = groupType ? GROUP_MEME[groupType] : null;
  const ticket = groupType ? computeTicket(groupType, numParticipants || 1) : null;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Who&apos;s joining the Mehfil?
      </h2>
      <p className="text-center text-rz-cream/70 mb-6">
        Pick your squad. Everything after this is personalized. 👀
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => selectGroup(opt.type)}
            className={`glass rounded-2xl px-4 py-6 flex flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 ${
              groupType === opt.type
                ? "border-rz-amber-400/70 bg-white/15 ring-1 ring-rz-amber-400/50"
                : ""
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="font-semibold">{opt.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {revealed && meme && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6"
          >
            <div className="glass rounded-2xl p-5 text-center">
              <span className="text-3xl">{meme.emoji}</span>
              <p className="mt-2 font-semibold">{meme.title}</p>
            </div>

            {groupType === "duo" && (
              <div className="mt-5 flex flex-col items-center gap-2">
                <span className="text-sm text-rz-cream/70">
                  How many in your squad?
                </span>
                <Stepper
                  value={numParticipants || 2}
                  min={2}
                  max={10}
                  onChange={(v) =>
                    setValue("num_participants", v, { shouldValidate: true })
                  }
                />
              </div>
            )}

            {ticket && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.5 }}
                className="mt-5 glass-strong rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{ticket.ticketType}</p>
                  <p className="text-xs text-rz-cream/60">
                    ☕ Coffee · 🎸 Jam · 🎨 Activities · 📸 Photos
                  </p>
                </div>
                <p className="font-display text-xl font-bold text-rz-amber-400">
                  {formatPkr(ticket.amount)}
                </p>
              </motion.div>
            )}

            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onNext}
              className="btn-primary w-full mt-6"
            >
              Continue →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
