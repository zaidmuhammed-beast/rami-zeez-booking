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

export const ambassadorFormSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name"),
  university: z.string().trim().min(2, "Which university do you attend?"),
  city: z.string().trim().min(2, "Which city are you in?"),
  study_year: z.string().trim().max(40).optional().or(z.literal("")),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(120)
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  instagram: z.string().trim().min(2, "Enter your Instagram username").max(80),
  follower_range: z.string().trim().max(40).optional().or(z.literal("")),
  why: z
    .string()
    .trim()
    .min(20, "Tell us a little about why you'd be great at this")
    .max(2000, "Keep it under 2000 characters"),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
  // Hidden field. Real people leave it empty; bots fill it in.
  company_website_url: z.string().max(200).optional().or(z.literal("")),
});

export type AmbassadorFormValues = z.input<typeof ambassadorFormSchema>;
