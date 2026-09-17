import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import type { BrandStatus } from "@/lib/types";

const ALLOWED_STATUSES = new Set<BrandStatus>([
  "new",
  "contacted",
  "confirmed",
  "declined",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const status = body.status;
  if (typeof status !== "string" || !ALLOWED_STATUSES.has(status as BrandStatus)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("brand_partners")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Couldn't update this enquiry." }, { status: 500 });
  }

  return NextResponse.json({ brand: data });
}
