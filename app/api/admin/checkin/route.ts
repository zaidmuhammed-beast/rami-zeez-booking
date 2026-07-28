import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { wristbandFor } from "@/lib/wristband";
import { generateLuckyDrawToken } from "@/lib/generate-ref";
import type { GroupType } from "@/lib/constants";

const SEATS_PER_TABLE = 6;

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  let bookingRef = "";
  try {
    const body = await request.json();
    bookingRef = String(body.booking_ref ?? "").toUpperCase().trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!bookingRef) {
    return NextResponse.json({ error: "Missing booking reference." }, { status: 400 });
  }

  const { data: existing, error: findError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("booking_ref", bookingRef)
    .maybeSingle();

  if (findError || !existing) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (existing.status === "pending_payment") {
    return NextResponse.json(
      { error: "This booking isn't marked Paid yet. Verify payment in the dashboard first." },
      { status: 409 }
    );
  }

  const updates: Record<string, unknown> = { status: "checked_in" };

  if (existing.quiz_number == null) {
    const { count } = await supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .not("quiz_number", "is", null);
    updates.quiz_number = (count || 0) + 1;
  }

  const quizNumber = (updates.quiz_number as number | undefined) ?? existing.quiz_number;
  if (existing.table_number == null && quizNumber != null) {
    const tableIdx = Math.ceil(quizNumber / SEATS_PER_TABLE);
    updates.table_number = `T${tableIdx}`;
  }

  if (existing.group_type === "couple" && existing.couple_number == null) {
    const { count } = await supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .not("couple_number", "is", null);
    updates.couple_number = (count || 0) + 1;
  }

  if (existing.wristband_color == null) {
    updates.wristband_color = wristbandFor(existing.group_type as GroupType).name;
  }
  if (existing.lucky_draw_token == null) {
    updates.lucky_draw_token = generateLuckyDrawToken();
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(updates)
    .eq("booking_ref", bookingRef)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Couldn't check in this booking." }, { status: 500 });
  }

  return NextResponse.json({ booking: data, alreadyCheckedIn: existing.status === "checked_in" });
}
