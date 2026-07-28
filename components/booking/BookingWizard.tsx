"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema, type BookingFormValues } from "@/lib/booking-schema";
import { computeTicket } from "@/lib/pricing";
import { StepShell } from "./StepShell";
import { GroupStep } from "./steps/GroupStep";
import { RegistrationStep } from "./steps/RegistrationStep";
import { FunQuestionsStep } from "./steps/FunQuestionsStep";
import { PaymentStep } from "./steps/PaymentStep";

export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredByCode = searchParams.get("ref");
  const [step, setStep] = useState(0);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      group_type: undefined as unknown as BookingFormValues["group_type"],
      num_participants: 1,
      primary_name: "",
      primary_phone: "",
      primary_whatsapp: "",
      primary_instagram: "",
      partner_name: "",
      partner_phone: "",
      partner_instagram: "",
      relationship_duration: "",
      fun_answers: {},
      payment_method: undefined as unknown as BookingFormValues["payment_method"],
    },
  });

  async function handleFinalSubmit() {
    setSubmitError(null);

    if (!screenshot) {
      setScreenshotError("Please upload your payment screenshot");
      return;
    }
    setScreenshotError(null);

    const values = form.getValues();
    const valid = await form.trigger();
    if (!valid) {
      setSubmitError("Please double check the highlighted fields.");
      return;
    }

    const ticket = computeTicket(values.group_type, values.num_participants);

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("group_type", values.group_type);
      fd.append("num_participants", String(values.num_participants));
      fd.append("primary_name", values.primary_name);
      fd.append("primary_phone", values.primary_phone);
      fd.append("primary_whatsapp", values.primary_whatsapp);
      fd.append("primary_instagram", values.primary_instagram);
      fd.append("primary_age", String(values.primary_age));
      fd.append("partner_name", values.partner_name || "");
      fd.append("partner_phone", values.partner_phone || "");
      fd.append("partner_instagram", values.partner_instagram || "");
      fd.append("relationship_duration", values.relationship_duration || "");
      fd.append("fun_answers", JSON.stringify(values.fun_answers || {}));
      fd.append("ticket_type", ticket.ticketType);
      fd.append("amount", String(ticket.amount));
      fd.append("payment_method", values.payment_method);
      fd.append("screenshot", screenshot);
      if (referredByCode) fd.append("referral_code", referredByCode);

      const res = await fetch("/api/bookings", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/confirmation/${data.booking_ref}`);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <StepShell step={step} onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}>
      {step === 0 && <GroupStep form={form} onNext={() => setStep(1)} />}
      {step === 1 && <RegistrationStep form={form} onNext={() => setStep(2)} />}
      {step === 2 && <FunQuestionsStep form={form} onNext={() => setStep(3)} />}
      {step === 3 && (
        <PaymentStep
          form={form}
          screenshot={screenshot}
          onScreenshotChange={(f) => {
            setScreenshot(f);
            if (f) setScreenshotError(null);
          }}
          screenshotError={screenshotError}
          onSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </StepShell>
  );
}
