"use client";

import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/booking-schema";
import { FUN_QUESTIONS } from "@/lib/constants";

type FunQuestionsStepProps = {
  form: UseFormReturn<BookingFormValues>;
  onNext: () => void;
};

export function FunQuestionsStep({ form, onNext }: FunQuestionsStepProps) {
  const { register } = form;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Time for the fun stuff 🎲
      </h2>
      <p className="text-center text-rz-cream/70 mb-6">
        These become your ice-breakers and Couple Quiz content. All optional,
        but way more fun if you answer honestly.
      </p>

      <div className="space-y-4">
        {FUN_QUESTIONS.map((q) => (
          <div key={q.key}>
            <label className="block text-sm mb-1.5 text-rz-cream/80">
              {q.emoji} {q.label}
            </label>
            <input
              className="input-glass"
              placeholder="Your answer..."
              {...register(`fun_answers.${q.key}`)}
            />
          </div>
        ))}
      </div>

      <button type="button" onClick={onNext} className="btn-primary w-full mt-8">
        Continue →
      </button>
    </div>
  );
}
