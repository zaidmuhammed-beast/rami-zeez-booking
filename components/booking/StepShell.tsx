"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

const STEP_LABELS = ["Vibe", "You", "Fun Stuff", "Payment"];

type StepShellProps = {
  step: number;
  children: ReactNode;
  onBack?: () => void;
  footer?: ReactNode;
};

export function StepShell({ step, children, onBack, footer }: StepShellProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 md:py-16">
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                i === step
                  ? "bg-gradient-to-r from-rz-amber-400 to-rz-amber-500 text-rz-purple-950"
                  : i < step
                  ? "bg-white/20 text-rz-cream"
                  : "bg-white/5 text-rz-cream/40"
              }`}
            >
              {i < step ? "✓" : i + 1} <span className="hidden sm:inline">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="h-px w-4 sm:w-8 bg-white/15" />
            )}
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <GlassCard className="p-6 sm:p-8">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 text-sm text-rz-cream/60 hover:text-rz-cream transition"
            >
              ← Back
            </button>
          )}
          {children}
        </GlassCard>
      </motion.div>

      {footer}
    </div>
  );
}
