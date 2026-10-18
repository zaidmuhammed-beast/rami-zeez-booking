import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { revolutionFormSchema } from "@/lib/revolution-schema";

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

  const parsed = revolutionFormSchema.safeParse(body);
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
    .from("revolution_members")
    .insert({
      full_name: data.full_name,
      city: data.city,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email || null,
      age_range: data.age_range,
      gender: data.gender,
      role: data.role,
      support_type: data.support_type || null,
      household_size: data.household_size || null,
      household_income: data.household_income || null,
      situation: data.situation || null,
      contributions: data.contributions,
      message: data.message || null,
    });

  if (insertError) {
    // Surface the real cause in the server logs — "relation does not exist"
    // means the migration hasn't been run yet.
    console.error("[revolution] insert failed", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });
    return NextResponse.json(
      {
        error:
          "Couldn't save your form. Please try again, or send it to us on WhatsApp.",
        code: insertError.code || "unknown",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
