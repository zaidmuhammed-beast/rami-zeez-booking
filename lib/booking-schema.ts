import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";

export const bookingFormSchema = z
  .object({
    group_type: z.enum(["single", "duo", "couple"]),
    num_participants: z.number().min(1).max(20),
    primary_name: z.string().trim().min(2, "Enter your full name"),
    primary_phone: z.string().trim().min(7, "Enter a valid phone number"),
    primary_whatsapp: z
      .string()
      .trim()
      .min(7, "Enter a valid WhatsApp number"),
    primary_instagram: z.string().trim().min(1, "Enter your Instagram username"),
    primary_age: z
      .number({ error: "Enter your age" })
      .min(13, "Must be 13+")
      .max(99, "Check your age"),
    partner_name: z.string().trim().optional().or(z.literal("")),
    partner_phone: z.string().trim().optional().or(z.literal("")),
    partner_instagram: z.string().trim().optional().or(z.literal("")),
    relationship_duration: z.string().optional().or(z.literal("")),
    buddy_name: z.string().trim().optional().or(z.literal("")),
    buddy_phone: z.string().trim().optional().or(z.literal("")),
    buddy_whatsapp: z.string().trim().optional().or(z.literal("")),
    buddy_instagram: z.string().trim().optional().or(z.literal("")),
    buddy_age: z.number().min(13, "Must be 13+").max(99, "Check age").optional(),
    fun_answers: z.record(z.string(), z.string()),
    payment_method: z.enum(PAYMENT_METHODS),
  })
  .superRefine((data, ctx) => {
    if (data.group_type === "couple") {
      if (!data.partner_name) {
        ctx.addIssue({
          code: "custom",
          path: ["partner_name"],
          message: "Enter your partner's name",
        });
      }
      if (!data.partner_phone) {
        ctx.addIssue({
          code: "custom",
          path: ["partner_phone"],
          message: "Enter your partner's phone number",
        });
      }
    }
    if (data.group_type === "duo") {
      if (!data.buddy_name) {
        ctx.addIssue({
          code: "custom",
          path: ["buddy_name"],
          message: "Enter your buddy's name",
        });
      }
      if (!data.buddy_phone) {
        ctx.addIssue({
          code: "custom",
          path: ["buddy_phone"],
          message: "Enter your buddy's phone number",
        });
      }
      if (!data.buddy_whatsapp) {
        ctx.addIssue({
          code: "custom",
          path: ["buddy_whatsapp"],
          message: "Enter your buddy's WhatsApp number",
        });
      }
      if (!data.buddy_instagram) {
        ctx.addIssue({
          code: "custom",
          path: ["buddy_instagram"],
          message: "Enter your buddy's Instagram username",
        });
      }
      if (data.buddy_age == null) {
        ctx.addIssue({
          code: "custom",
          path: ["buddy_age"],
          message: "Enter your buddy's age",
        });
      }
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const STEP_FIELDS: Record<number, (keyof BookingFormValues)[]> = {
  0: ["group_type", "num_participants"],
  1: [
    "primary_name",
    "primary_phone",
    "primary_whatsapp",
    "primary_instagram",
    "primary_age",
    "partner_name",
    "partner_phone",
    "partner_instagram",
    "relationship_duration",
    "buddy_name",
    "buddy_phone",
    "buddy_whatsapp",
    "buddy_instagram",
    "buddy_age",
  ],
  2: ["fun_answers"],
  3: ["payment_method"],
};
