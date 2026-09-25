import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { brandFormSchema } from "@/lib/brand-schema";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Submissions aren't configured yet. Please reach us on WhatsApp instead.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const parsed = brandFormSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "Please check your details and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: only a bot fills this in. Look successful, store nothing.
  if (data.company_website_url) {
    return NextResponse.json({ ok: true });
  }

  const { error: insertError } = await supabaseAdmin
    .from("brand_partners")
    .insert({
      brand_name: data.brand_name,
      contact_name: data.contact_name,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      instagram: data.instagram,
      website: data.website,
      category: data.category,
      interest: data.interest,
      events: data.events,
      description: data.description,
      budget: data.budget,
    });

  if (insertError) {
    // Surface the real cause in the server logs — "relation does not exist"
    // means the migration hasn't been run yet.
    console.error("[brands] insert failed", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });
    return NextResponse.json(
      {
        error:
          "Couldn't save your details. Please try again, or send them to us on WhatsApp.",
        // Shown small under the message — lets anyone report the real cause.
        code: insertError.code || "unknown",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
