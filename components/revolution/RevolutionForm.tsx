"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  revolutionFormSchema,
  AGE_RANGES,
  CONTRIBUTIONS,
  GENDERS,
  HOUSEHOLD_INCOMES,
  ROLES,
  SUPPORT_TYPES,
  type RevolutionFormValues,
} from "@/lib/revolution-schema";
import { EVENT } from "@/lib/constants";
import { MOVEMENT } from "@/lib/movement";
import { businessChatLink } from "@/lib/whatsapp";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-300">{message}</p>;
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="block text-sm mb-1.5 text-rz-cream/80">
      {children}
      {hint && <span className="text-rz-cream/45"> · {hint}</span>}
    </label>
  );
}

export function RevolutionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [rescueLink, setRescueLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RevolutionFormValues>({
    resolver: zodResolver(revolutionFormSchema),
    defaultValues: {
      full_name: "",
      city: "",
      phone: "",
      whatsapp: "",
      email: "",
      age_range: undefined,
      gender: undefined,
      role: undefined,
      support_type: "",
      household_size: "",
      household_income: "",
      situation: "",
      contributions: [],
      message: "",
      company_website_url: "",
    },
  });

  const role = useWatch({ control, name: "role" });
  const contributions = useWatch({ control, name: "contributions" }) || [];
  const needsSupport = role === "receive" || role === "both";
  const givesSupport = role === "provide" || role === "both";

  function toggleContribution(value: string) {
    const next = contributions.includes(value)
      ? contributions.filter((c) => c !== value)
      : [...contributions, value];
    setValue("contributions", next, { shouldValidate: true });
  }

  /** Their answers as a WhatsApp message, so a failed save isn't a lost lead. */
  function buildRescueLink(values: RevolutionFormValues) {
    const lines = [
      `Hi ${EVENT.brand}! The ${MOVEMENT.name} form wouldn't submit, so here are my details 🤲`,
      "",
      `Name: ${values.full_name}`,
      `City: ${values.city}`,
      `Phone: ${values.phone}`,
      `WhatsApp: ${values.whatsapp}`,
      values.email ? `Email: ${values.email}` : "",
      `Joining as: ${values.role}`,
      values.support_type ? `Needs: ${values.support_type}` : "",
      values.situation ? `Situation: ${values.situation}` : "",
      (values.contributions || []).length
        ? `Can offer: ${(values.contributions || []).join(", ")}`
        : "",
    ].filter(Boolean);
    return businessChatLink(lines.join("\n"));
  }

  async function onSubmit(values: RevolutionFormValues) {
    setSubmitError(null);
    setErrorCode(null);
    setRescueLink(null);
    try {
      const res = await fetch("/api/revolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(json.error || "Something went wrong. Please try again.");
        setErrorCode(json.code || null);
        setRescueLink(buildRescueLink(values));
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Couldn't reach the server. Check your connection, or send it to us on WhatsApp."
      );
      setRescueLink(buildRescueLink(values));
    }
  }

  if (submitted) {
    return (
      <GlassCard strong className="relative overflow-hidden p-8 text-center">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-mint via-hue-yellow to-hue-pink"
        />
        <span className="text-4xl">🤲</span>
        <h2 className="font-display text-2xl font-bold mt-3">
          You&apos;re in. Thank you.
        </h2>
        <p className="mt-3 text-rz-cream/75 max-w-md mx-auto">
          The core team reads every submission. We&apos;ll message you on
          WhatsApp — if you asked for support, we&apos;ll talk through what you
          need and what we can do.
        </p>
        <a
          href={businessChatLink(
            `Hi ${EVENT.brand}! I just submitted the ${MOVEMENT.name} form 🤲`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-7"
        >
          💬 Message us now
        </a>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <GlassCard strong className="relative overflow-hidden p-6 sm:p-8">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-mint"
        />

        {/* ------------------------------------------------------- About you */}
        <p className="font-display font-bold mb-4">1. About you</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full name</Label>
              <input className="input-glass" placeholder="Your name" {...register("full_name")} />
              <FieldError message={errors.full_name?.message} />
            </div>
            <div>
              <Label>City / district</Label>
              <input className="input-glass" placeholder="e.g. Lahore" {...register("city")} />
              <FieldError message={errors.city?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Phone number</Label>
              <input className="input-glass" placeholder="03xx xxxxxxx" inputMode="tel" {...register("phone")} />
              <FieldError message={errors.phone?.message} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <input className="input-glass" placeholder="03xx xxxxxxx" inputMode="tel" {...register("whatsapp")} />
              <FieldError message={errors.whatsapp?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Age</Label>
              <select className="input-glass" defaultValue="" {...register("age_range")}>
                <option value="" disabled>Pick one</option>
                {AGE_RANGES.map((a) => (
                  <option key={a} value={a} className="bg-rz-purple-900">{a}</option>
                ))}
              </select>
              <FieldError message={errors.age_range?.message} />
            </div>
            <div>
              <Label>Gender</Label>
              <select className="input-glass" defaultValue="" {...register("gender")}>
                <option value="" disabled>Pick one</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g} className="bg-rz-purple-900">{g}</option>
                ))}
              </select>
              <FieldError message={errors.gender?.message} />
            </div>
            <div>
              <Label hint="optional">Email</Label>
              <input className="input-glass" placeholder="you@email.com" inputMode="email" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ Your role */}
        <p className="font-display font-bold mt-8 mb-4">2. How are you joining?</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ROLES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("role", opt.value, { shouldValidate: true })}
              className={`glass rounded-2xl px-4 py-5 flex flex-col items-center gap-1.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 ${
                role === opt.value
                  ? "border-rz-amber-400/70 bg-white/15 ring-1 ring-rz-amber-400/50"
                  : ""
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className="text-xs text-rz-cream/55">{opt.note}</span>
            </button>
          ))}
        </div>
        <FieldError message={errors.role?.message} />

        {/* -------------------------------------------------- Needs support */}
        {needsSupport && (
          <>
            <p className="font-display font-bold mt-8 mb-2">3. What would help you start</p>
            <p className="text-sm text-rz-cream/60 mb-4">
              Anyone can apply — any age, any gender, any kind of work. This
              stays between you and the core team.
            </p>
            <div className="space-y-4">
              <div>
                <Label>What do you need to start earning?</Label>
                <select className="input-glass" defaultValue="" {...register("support_type")}>
                  <option value="" disabled>Pick one</option>
                  {SUPPORT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-rz-purple-900">{t}</option>
                  ))}
                </select>
                <FieldError message={errors.support_type?.message} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>People depending on you</Label>
                  <input
                    className="input-glass"
                    placeholder="e.g. 4"
                    inputMode="numeric"
                    {...register("household_size")}
                  />
                  <FieldError message={errors.household_size?.message} />
                </div>
                <div>
                  <Label>Household income</Label>
                  <select className="input-glass" defaultValue="" {...register("household_income")}>
                    <option value="" disabled>Pick one</option>
                    {HOUSEHOLD_INCOMES.map((i) => (
                      <option key={i} value={i} className="bg-rz-purple-900">{i}</option>
                    ))}
                  </select>
                  <FieldError message={errors.household_income?.message} />
                </div>
              </div>

              <div>
                <Label>Your situation</Label>
                <textarea
                  className="input-glass min-h-28 resize-y"
                  rows={4}
                  placeholder="What you're dealing with right now, and what you'd do with the support."
                  {...register("situation")}
                />
                <FieldError message={errors.situation?.message} />
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------- Gives support */}
        {givesSupport && (
          <>
            <p className="font-display font-bold mt-8 mb-4">
              {needsSupport ? "4." : "3."} What you can offer
            </p>
            <div className="flex flex-wrap gap-2">
              {CONTRIBUTIONS.map((c) => {
                const on = contributions.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleContribution(c)}
                    aria-pressed={on}
                    className={`chip text-sm transition ${
                      on
                        ? "border-rz-amber-400/70 bg-white/15 text-rz-cream"
                        : "text-rz-cream/70 hover:bg-white/15"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.contributions?.message} />
          </>
        )}

        {/* ---------------------------------------------------- Anything else */}
        <p className="font-display font-bold mt-8 mb-4">
          {needsSupport && givesSupport ? "5." : role ? "4." : "3."} Anything else
        </p>
        <div>
          <Label hint="optional">
            Someone you want to refer, or anything we should know
          </Label>
          <textarea
            className="input-glass min-h-20 resize-y"
            rows={3}
            placeholder="Do you know someone deserving who would never ask for help themselves?"
            {...register("message")}
          />
        </div>

        {/* Honeypot — hidden from people, catnip for bots. */}
        <div className="hidden" aria-hidden>
          <label>
            Do not fill this in
            <input tabIndex={-1} autoComplete="off" {...register("company_website_url")} />
          </label>
        </div>

        {submitError && (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4">
            <p className="text-sm text-rose-200">{submitError}</p>
            {errorCode && (
              <p className="mt-1 text-[11px] font-mono text-rz-cream/45">
                ref: {errorCode}
              </p>
            )}
            {rescueLink && (
              <>
                <p className="mt-2 text-xs text-rz-cream/70">
                  Don&apos;t retype it — send us what you wrote in one tap.
                </p>
                <a
                  href={rescueLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost mt-3 w-full text-sm"
                >
                  💬 Send my form on WhatsApp
                </a>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-8 disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "✊ Become Part Of Revolution"}
        </button>

        <p className="mt-4 text-center text-xs text-rz-cream/50">
          Everything you write here is read only by the core team.
        </p>
      </GlassCard>
    </form>
  );
}
