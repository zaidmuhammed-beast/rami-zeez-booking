"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ambassadorFormSchema,
  FOLLOWER_RANGES,
  STUDY_YEARS,
  type AmbassadorFormValues,
} from "@/lib/ambassador-schema";
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

export function AmbassadorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rescueLink, setRescueLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AmbassadorFormValues>({
    resolver: zodResolver(ambassadorFormSchema),
    defaultValues: {
      full_name: "",
      university: "",
      city: "",
      study_year: "",
      phone: "",
      whatsapp: "",
      email: "",
      instagram: "",
      follower_range: "",
      why: "",
      experience: "",
      company_website_url: "",
    },
  });

  /** Their answers as a WhatsApp message, so a failed save isn't a lost lead. */
  function buildRescueLink(values: AmbassadorFormValues) {
    const lines = [
      `Hi ${EVENT.brand}! The ambassador form wouldn't submit, so here are my details 🎓`,
      "",
      `Name: ${values.full_name}`,
      `University: ${values.university}`,
      `City: ${values.city}`,
      values.study_year ? `Year: ${values.study_year}` : "",
      `Phone: ${values.phone}`,
      values.email ? `Email: ${values.email}` : "",
      `Instagram: ${values.instagram}`,
      values.follower_range ? `Followers: ${values.follower_range}` : "",
      "",
      `Why me: ${values.why}`,
      values.experience ? `Experience: ${values.experience}` : "",
    ].filter(Boolean);
    return businessChatLink(lines.join("\n"));
  }

  async function onSubmit(values: AmbassadorFormValues) {
    setSubmitError(null);
    setRescueLink(null);
    try {
      const res = await fetch("/api/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(json.error || "Something went wrong. Please try again.");
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
        <span className="text-4xl">🎓</span>
        <h2 className="font-display text-2xl font-bold mt-3">
          Application in — nice one!
        </h2>
        <p className="mt-3 text-rz-cream/75 max-w-md mx-auto">
          We read every one of these. If you look like a fit, we&apos;ll message
          you on WhatsApp with the next steps and your referral link.
        </p>
        <a
          href={businessChatLink(
            `Hi ${EVENT.brand}! I just applied to be a campus ambassador 🎓`
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
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-hue-sky via-hue-mint to-hue-yellow"
        />

        {/* ---------------------------------------------------------- You */}
        <p className="font-display font-bold mb-4">1. About you</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full name</Label>
              <input
                className="input-glass"
                placeholder="Your name"
                {...register("full_name")}
              />
              <FieldError message={errors.full_name?.message} />
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
                placeholder="you@university.edu.pk"
                inputMode="email"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- Campus */}
        <p className="font-display font-bold mt-8 mb-4">2. Your campus</p>
        <div className="space-y-4">
          <div>
            <Label>University</Label>
            <input
              className="input-glass"
              placeholder="e.g. IBA Karachi"
              {...register("university")}
            />
            <FieldError message={errors.university?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <input
                className="input-glass"
                placeholder="e.g. Karachi"
                {...register("city")}
              />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <Label hint="optional">Year of study</Label>
              <select className="input-glass" defaultValue="" {...register("study_year")}>
                <option value="">Prefer not to say</option>
                {STUDY_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-rz-purple-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- Reach */}
        <p className="font-display font-bold mt-8 mb-4">3. Your reach</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Instagram</Label>
            <input
              className="input-glass"
              placeholder="@yourhandle"
              {...register("instagram")}
            />
            <FieldError message={errors.instagram?.message} />
          </div>
          <div>
            <Label hint="optional">Followers</Label>
            <select className="input-glass" defaultValue="" {...register("follower_range")}>
              <option value="">Prefer not to say</option>
              {FOLLOWER_RANGES.map((r) => (
                <option key={r} value={r} className="bg-rz-purple-900">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* -------------------------------------------------------- Pitch */}
        <p className="font-display font-bold mt-8 mb-4">4. Your pitch</p>
        <div className="space-y-4">
          <div>
            <Label>Why you&apos;d be great at this</Label>
            <textarea
              className="input-glass min-h-28 resize-y"
              rows={4}
              placeholder="How you'd get your campus out to an event, the crowd you can reach, what you'd bring to it."
              {...register("why")}
            />
            <FieldError message={errors.why?.message} />
          </div>
          <div>
            <Label hint="optional">Societies or events you&apos;ve worked on</Label>
            <textarea
              className="input-glass min-h-20 resize-y"
              rows={3}
              placeholder="Anything you've organised, hosted or promoted before."
              {...register("experience")}
            />
          </div>
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
                  💬 Send my application on WhatsApp
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
          {isSubmitting ? "Sending…" : "🎓 Apply to be an ambassador"}
        </button>

        <p className="mt-4 text-center text-xs text-rz-cream/50">
          We only use these details to get back to you about the ambassador
          programme.
        </p>
      </GlassCard>
    </form>
  );
}
