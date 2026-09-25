import { z } from "zod";

export const BRAND_CATEGORIES = [
  "Food & Beverage",
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Art, Craft & Stationery",
  "Tech & Gadgets",
  "Services",
  "Other",
] as const;

export const BRAND_INTERESTS = [
  { value: "stall", emoji: "🏪", label: "Stall at the event" },
  { value: "promotion", emoji: "📣", label: "Promotion / branding" },
  { value: "both", emoji: "✨", label: "Both" },
] as const;

export const BRAND_BUDGETS = [
  "Under PKR 25,000",
  "PKR 25,000 – 50,000",
  "PKR 50,000 – 100,000",
  "PKR 100,000+",
  "Not sure yet",
] as const;

// Every field is required — we want a complete picture of each brand.
export const brandFormSchema = z.object({
  brand_name: z.string().trim().min(2, "Enter your brand or business name"),
  contact_name: z.string().trim().min(2, "Enter the contact person's name"),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  whatsapp: z.string().trim().min(7, "Enter your WhatsApp number").max(30),
  email: z.string().trim().min(1, "Enter your email").max(120).email("Enter a valid email"),
  instagram: z.string().trim().min(2, "Enter your Instagram handle").max(80),
  website: z
    .string()
    .trim()
    .min(2, "Enter your website — write \"none\" if you don't have one")
    .max(200),
  category: z.enum(BRAND_CATEGORIES, { error: "Pick a category" }),
  interest: z.enum(["stall", "promotion", "both"], {
    error: "Tell us what you're after",
  }),
  events: z
    .array(z.string().max(60))
    .min(1, "Pick at least one event you're interested in")
    .max(20),
  description: z
    .string()
    .trim()
    .min(20, "A couple of lines about what you offer, please")
    .max(2000, "Keep it under 2000 characters"),
  budget: z.enum(BRAND_BUDGETS, { error: "Pick a budget range" }),
  // Hidden field. Real people leave it empty; bots fill it in.
  company_website_url: z.string().max(200).optional().or(z.literal("")),
});

export type BrandFormValues = z.input<typeof brandFormSchema>;
export type BrandFormParsed = z.output<typeof brandFormSchema>;
