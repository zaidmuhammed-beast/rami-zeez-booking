import { z } from "zod";

export const STUDY_YEARS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "Masters",
  "Recently graduated",
] as const;

export const FOLLOWER_RANGES = [
  "Under 500",
  "500 – 2,000",
  "2,000 – 10,000",
  "10,000+",
] as const;

// Every field is required — we want a complete picture of each applicant.
export const ambassadorFormSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name"),
  university: z.string().trim().min(2, "Which university do you attend?"),
  city: z.string().trim().min(2, "Which city are you in?"),
  study_year: z.enum(STUDY_YEARS, { error: "Pick your year of study" }),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  whatsapp: z.string().trim().min(7, "Enter your WhatsApp number").max(30),
  email: z.string().trim().min(1, "Enter your email").max(120).email("Enter a valid email"),
  instagram: z.string().trim().min(2, "Enter your Instagram username").max(80),
  follower_range: z.enum(FOLLOWER_RANGES, { error: "Pick your follower range" }),
  why: z
    .string()
    .trim()
    .min(20, "Tell us a little about why you'd be great at this")
    .max(2000, "Keep it under 2000 characters"),
  experience: z
    .string()
    .trim()
    .min(2, "Tell us what you've worked on — write \"none\" if this is your first")
    .max(2000, "Keep it under 2000 characters"),
  // Hidden field. Real people leave it empty; bots fill it in.
  company_website_url: z.string().max(200).optional().or(z.literal("")),
});

export type AmbassadorFormValues = z.input<typeof ambassadorFormSchema>;
