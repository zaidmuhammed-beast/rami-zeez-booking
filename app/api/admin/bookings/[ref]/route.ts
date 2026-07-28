import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";

const ALLOWED_FIELDS = new Set([
  "status",
  "coffee_claimed",
  "quiz_number",
  "table_number",
  "couple_number",
  "badges",
  "wristband_color",
  "lucky_draw_token",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  const { ref } = await params;
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("booking_ref", ref.toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ booking: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  const { ref } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_FIELDS.has(key)) updates[key] = value;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(updates)
    .eq("booking_ref", ref.toUpperCase())
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Couldn't update booking." }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
