import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  isSupabaseAdminConfigured,
  PAYMENT_SCREENSHOTS_BUCKET,
} from "@/lib/supabase-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const { ref } = await params;

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .select("payment_screenshot_url")
    .eq("booking_ref", ref.toUpperCase())
    .maybeSingle();

  if (error || !booking?.payment_screenshot_url) {
    return NextResponse.json({ error: "No screenshot found." }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from(PAYMENT_SCREENSHOTS_BUCKET)
    .createSignedUrl(booking.payment_screenshot_url, 300);

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Couldn't generate screenshot link." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: signed.signedUrl });
}
