"use client";

import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/booking-schema";
import { RELATIONSHIP_DURATIONS } from "@/lib/constants";

type RegistrationStepProps = {
  form: UseFormReturn<BookingFormValues>;
  onNext: () => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-300">{message}</p>;
}

export function RegistrationStep({ form, onNext }: RegistrationStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = form;
  const groupType = watch("group_type");
  const relationshipDuration = watch("relationship_duration");

  async function handleContinue() {
    const fields: (keyof BookingFormValues)[] = [
      "primary_name",
      "primary_phone",
      "primary_whatsapp",
      "primary_instagram",
      "primary_age",
    ];
    if (groupType === "couple") {
      fields.push("partner_name", "partner_phone");
    }
    const valid = await trigger(fields);
    if (valid) onNext();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-center mb-1">
        Tell us about you
      </h2>
      <p className="text-center text-rz-cream/70 mb-6">
        Just the essentials — takes 30 seconds.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1.5 text-rz-cream/80">
            Full Name
          </label>
          <input className="input-glass" placeholder="Ali Khan" {...register("primary_name")} />
          <FieldError message={errors.primary_name?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5 text-rz-cream/80">
              Active Phone Number
            </label>
            <input
              className="input-glass"
              placeholder="03xx xxxxxxx"
              {...register("primary_phone")}
            />
            <FieldError message={errors.primary_phone?.message} />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-rz-cream/80">
              WhatsApp Number
            </label>
            <input
              className="input-glass"
              placeholder="03xx xxxxxxx"
              {...register("primary_whatsapp")}
            />
            <FieldError message={errors.primary_whatsapp?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5 text-rz-cream/80">
              Instagram Username
            </label>
            <input
              className="input-glass"
              placeholder="@yourhandle"
              {...register("primary_instagram")}
            />
            <FieldError message={errors.primary_instagram?.message} />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-rz-cream/80">Age</label>
            <input
              type="number"
              className="input-glass"
              placeholder="21"
              {...register("primary_age", { valueAsNumber: true })}
            />
            <FieldError message={errors.primary_age?.message} />
          </div>
        </div>

        {groupType === "couple" && (
          <div className="pt-4 mt-2 border-t border-white/10">
            <p className="font-semibold mb-3 flex items-center gap-2">
              ❤️ Partner Details
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5 text-rz-cream/80">
                  Partner Name
                </label>
                <input
                  className="input-glass"
                  placeholder="Partner's full name"
                  {...register("partner_name")}
                />
                <FieldError message={errors.partner_name?.message} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5 text-rz-cream/80">
                    Partner Phone
                  </label>
                  <input
                    className="input-glass"
                    placeholder="03xx xxxxxxx"
                    {...register("partner_phone")}
                  />
                  <FieldError message={errors.partner_phone?.message} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-rz-cream/80">
                    Partner Instagram
                  </label>
                  <input
                    className="input-glass"
                    placeholder="@theirhandle"
                    {...register("partner_instagram")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-rz-cream/80">
                  How long have you been together?{" "}
                  <span className="text-rz-cream/50">
                    (optional, for the Couple Quiz only)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {RELATIONSHIP_DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setValue("relationship_duration", d)}
                      className={`rounded-xl px-3 py-2.5 text-sm text-left transition ${
                        relationshipDuration === d
                          ? "bg-rz-amber-400/90 text-rz-purple-950 font-semibold"
                          : "bg-white/8 hover:bg-white/15"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="button" onClick={handleContinue} className="btn-primary w-full mt-8">
        Continue →
      </button>
    </div>
  );
}
