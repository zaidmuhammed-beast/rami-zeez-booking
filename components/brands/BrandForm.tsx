"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  brandFormSchema,
  BRAND_BUDGETS,
  BRAND_CATEGORIES,
  BRAND_INTERESTS,
  type BrandFormValues,
} from "@/lib/brand-schema";
import { EVENTS } from "@/lib/events";
import { EVENT } from "@/lib/constants";
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

export function BrandForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      brand_name: "",
      contact_name: "",
      phone: "",
      whatsapp: "",
      email: "",
      instagram: "",
      website: "",
      category: undefined,
      interest: undefined,
      events: [],
      description: "",
      budget: "",
      company_website_url: "",
    },
  });

  // useWatch keeps this subscription memoizable, unlike watch().
  const interest = useWatch({ control, name: "interest" });
  const selectedEvents = useWatch({ control, name: "events" }) || [];

  function toggleEvent(slug: string) {
    const next = selectedEvents.includes(slug)
      ? selectedEvents.filter((s) => s !== slug)
      : [...selectedEvents, slug];
    setValue("events", next, { shouldValidate: true });
  }

  async function onSubmit(values: BrandFormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Couldn't reach the server. Check your connection, or send us the details on WhatsApp."
      );
    }
  }

  if (submitted) {
    return (
      <GlassCard strong className="relative overflow-hidden p-8 text-center">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-mint via-hue-yellow to-hue-pink"
        />
        <span className="text-4xl">🤝</span>
        <h2 className="font-display text-2xl font-bold mt-3">
          Got it — thanks!
        </h2>
        <p className="mt-3 text-rz-cream/75 max-w-md mx-auto">
          Your details are with the {EVENT.brand} team. We&apos;ll get back to
          you on WhatsApp with stall options, pricing and the next available
          event.
        </p>
        <a
          href={businessChatLink(
            `Hi ${EVENT.brand}! I just submitted my brand details for a stall / promotion 🤝`
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
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-pink via-hue-yellow to-hue-sky"
        />

        {/* ------------------------------------------------------ The brand */}
        <p className="font-display font-bold mb-4">1. Your brand</p>
        <div className="space-y-4">
          <div>
            <Label>Brand / business name</Label>
            <input
              className="input-glass"
              placeholder="e.g. The Coffee Cart"
              {...register("brand_name")}
            />
            <FieldError message={errors.brand_name?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Contact person</Label>
              <input
                className="input-glass"
                placeholder="Your name"
                {...register("contact_name")}
              />
              <FieldError message={errors.contact_name?.message} />
            </div>
            <div>
              <Label>Phone number</Label>
              <input
                className="input-glass"
                placeholder="03xx xxxxxxx"
                inputMode="tel"
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label hint="optional">WhatsApp</Label>
              <input
                className="input-glass"
                placeholder="If different from above"
                inputMode="tel"
                {...register("whatsapp")}
              />
              <FieldError message={errors.whatsapp?.message} />
            </div>
            <div>
              <Label hint="optional">Email</Label>
              <input
                className="input-glass"
                placeholder="hello@brand.com"
                inputMode="email"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label hint="optional">Instagram</Label>
              <input
                className="input-glass"
                placeholder="@yourbrand"
                {...register("instagram")}
              />
              <FieldError message={errors.instagram?.message} />
            </div>
            <div>
              <Label hint="optional">Website</Label>
              <input
                className="input-glass"
                placeholder="yourbrand.com"
                {...register("website")}
              />
              <FieldError message={errors.website?.message} />
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <select className="input-glass" defaultValue="" {...register("category")}>
              <option value="" disabled>
                Pick one
              </option>
              {BRAND_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-rz-purple-900">
                  {c}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>
        </div>

        {/* --------------------------------------------------- What you want */}
        <p className="font-display font-bold mt-8 mb-4">2. What you&apos;re after</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BRAND_INTERESTS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setValue("interest", opt.value, { shouldValidate: true })
              }
              className={`glass rounded-2xl px-4 py-5 flex flex-col items-center gap-2 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 ${
                interest === opt.value
                  ? "border-rz-amber-400/70 bg-white/15 ring-1 ring-rz-amber-400/50"
                  : ""
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-sm font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
        <FieldError message={errors.interest?.message} />

        <div className="mt-5">
          <Label hint="optional, pick any">Events you&apos;re interested in</Label>
          <div className="flex flex-wrap gap-2">
            {EVENTS.filter((e) => e.status !== "completed").map((e) => {
              const on = selectedEvents.includes(e.slug);
              return (
                <button
                  key={e.slug}
                  type="button"
                  onClick={() => toggleEvent(e.slug)}
                  className={`chip text-sm transition ${
                    on
                      ? "border-rz-amber-400/70 bg-white/15 text-rz-cream"
                      : "text-rz-cream/70 hover:bg-white/15"
                  }`}
                  aria-pressed={on}
                >
                  {e.emoji} {e.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <Label hint="optional">Budget range</Label>
          <select className="input-glass" defaultValue="" {...register("budget")}>
            <option value="">Prefer not to say</option>
            {BRAND_BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-rz-purple-900">
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* ---------------------------------------------------- The pitch */}
        <p className="font-display font-bold mt-8 mb-4">3. Tell us about it</p>
        <div>
          <Label>Your product or service</Label>
          <textarea
            className="input-glass min-h-32 resize-y"
            rows={5}
            placeholder="What you sell, what you'd bring to the event, and anything you'd like us to know."
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Honeypot — hidden from people, catnip for bots. */}
        <div className="hidden" aria-hidden>
          <label>
            Do not fill this in
            <input tabIndex={-1} autoComplete="off" {...register("company_website_url")} />
          </label>
        </div>

        {submitError && (
          <p className="mt-6 text-sm text-rose-300">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-8 disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "🤝 Send my details"}
        </button>

        <p className="mt-4 text-center text-xs text-rz-cream/50">
          We only use these details to get back to you about stalls and
          promotions.
        </p>
      </GlassCard>
    </form>
  );
}
