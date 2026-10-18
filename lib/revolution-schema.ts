import { z } from "zod";

export const ROLES = [
  {
    value: "receive",
    emoji: "🤲",
    label: "I need support",
    note: "Startup tools or materials to begin earning",
  },
  {
    value: "provide",
    emoji: "💛",
    label: "I want to support",
    note: "Money, tools, skills or time",
  },
  {
    value: "both",
    emoji: "🤝",
    label: "Both",
    note: "I can help, and I know someone who needs it",
  },
] as const;

export const AGE_RANGES = ["15 – 20", "21 – 27", "28 – 35", "36 – 50", "50+"] as const;

export const GENDERS = ["Male", "Female", "Prefer not to say"] as const;

/** Deliberately broad — the programme is for anyone who needs a start. */
export const SUPPORT_TYPES = [
  "Food cart / street food setup",
  "Small retail shop / general store",
  "Sewing, tailoring or embroidery",
  "Baking or home-based food production",
  "Handicrafts or handmade products",
  "Beauty services (home-based)",
  "Mobile or electronics repair",
  "Tools for daily-wage work (labour, repair, delivery)",
  "Transport — bike, rickshaw or cart for work",
  "School or training fees",
  "I'm not sure yet — I need guidance",
  "Other",
] as const;

export const HOUSEHOLD_INCOMES = [
  "No income right now",
  "Under PKR 20,000 a month",
  "PKR 20,000 – 40,000",
  "PKR 40,000 – 70,000",
  "Above PKR 70,000",
] as const;

export const CONTRIBUTIONS = [
  "Financial — one-time",
  "Financial — monthly",
  "Tools or equipment",
  "Raw materials or supplies",
  "Business mentorship or training",
  "Workspace or shop space",
  "Marketing and selling support",
  "Volunteer time",
  "Legal help",
] as const;

export const revolutionFormSchema = z
  .object({
    full_name: z.string().trim().min(2, "Enter your full name"),
    city: z.string().trim().min(2, "Which city or district are you in?"),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
    whatsapp: z.string().trim().min(7, "Enter your WhatsApp number").max(30),
    email: z.string().trim().max(120).email("Enter a valid email").optional().or(z.literal("")),
    age_range: z.enum(AGE_RANGES, { error: "Pick your age range" }),
    gender: z.enum(GENDERS, { error: "Pick one" }),

    role: z.enum(["receive", "provide", "both"], {
      error: "Tell us how you're joining",
    }),

    // Needed when they're asking for support.
    support_type: z.string().trim().max(80).optional().or(z.literal("")),
    household_size: z.string().trim().max(10).optional().or(z.literal("")),
    household_income: z.string().trim().max(60).optional().or(z.literal("")),
    situation: z.string().trim().max(2000).optional().or(z.literal("")),

    // Needed when they're offering support.
    contributions: z.array(z.string().max(60)).max(20).default([]),

    message: z.string().trim().max(2000).optional().or(z.literal("")),
    // Hidden field. Real people leave it empty; bots fill it in.
    company_website_url: z.string().max(200).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const needsSupport = data.role === "receive" || data.role === "both";
    const givesSupport = data.role === "provide" || data.role === "both";

    if (needsSupport) {
      if (!data.support_type) {
        ctx.addIssue({
          code: "custom",
          path: ["support_type"],
          message: "Pick what would help you start earning",
        });
      }
      if (!data.household_size) {
        ctx.addIssue({
          code: "custom",
          path: ["household_size"],
          message: "How many people depend on you?",
        });
      }
      if (!data.household_income) {
        ctx.addIssue({
          code: "custom",
          path: ["household_income"],
          message: "Pick your household income range",
        });
      }
      if (!data.situation || data.situation.length < 20) {
        ctx.addIssue({
          code: "custom",
          path: ["situation"],
          message: "Tell us your situation — a few lines is enough",
        });
      }
    }

    if (givesSupport && data.contributions.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["contributions"],
        message: "Pick at least one way you can help",
      });
    }
  });

export type RevolutionFormValues = z.input<typeof revolutionFormSchema>;
