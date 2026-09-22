import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { ambassadorFormSchema } from "@/lib/ambassador-schema";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Applications aren't configured yet. Please reach us on WhatsApp instead.",
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

  const parsed = ambassadorFormSchema.safeParse(body);
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

  const { error: insertError } = await supabaseAdmin.from("ambassadors").insert({
    full_name: data.full_name,
    university: data.university,
    city: data.city,
    study_year: data.study_year || null,
    phone: data.phone,
    whatsapp: data.whatsapp || null,
    email: data.email || null,
    instagram: data.instagram,
    follower_range: data.follower_range || null,
    why: data.why,
    experience: data.experience || null,
  });

  if (insertError) {
    return NextResponse.json(
      {
        error:
          "Couldn't save your application. Please try again, or send it to us on WhatsApp.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
