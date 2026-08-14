import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  isSupabaseAdminConfigured,
  PAYMENT_SCREENSHOTS_BUCKET,
} from "@/lib/supabase-admin";
import { bookingFormSchema } from "@/lib/booking-schema";
import { computeTicket } from "@/lib/pricing";
import { generateBookingRef, generateReferralCode } from "@/lib/generate-ref";

const MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Booking storage isn't configured yet. Add your Supabase keys to .env.local (see .env.local.example) and restart the server.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const getStr = (key: string) => (formData.get(key)?.toString() ?? "").trim();

  let funAnswers: Record<string, string> = {};
  try {
    funAnswers = JSON.parse(getStr("fun_answers") || "{}");
  } catch {
    funAnswers = {};
  }

  const buddyAgeStr = getStr("buddy_age");

  const raw = {
    group_type: getStr("group_type"),
    num_participants: Number(getStr("num_participants")) || 1,
    primary_name: getStr("primary_name"),
    primary_phone: getStr("primary_phone"),
    primary_whatsapp: getStr("primary_whatsapp"),
    primary_instagram: getStr("primary_instagram"),
    primary_age: Number(getStr("primary_age")),
    partner_name: getStr("partner_name"),
    partner_phone: getStr("partner_phone"),
    partner_instagram: getStr("partner_instagram"),
    relationship_duration: getStr("relationship_duration"),
    buddy_name: getStr("buddy_name"),
    buddy_phone: getStr("buddy_phone"),
    buddy_whatsapp: getStr("buddy_whatsapp"),
    buddy_instagram: getStr("buddy_instagram"),
    buddy_age: buddyAgeStr ? Number(buddyAgeStr) : undefined,
    fun_answers: funAnswers,
    payment_method: getStr("payment_method"),
  };

  const parsed = bookingFormSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "Please check your details and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const ticket = computeTicket(data.group_type, data.num_participants);

  const screenshot = formData.get("screenshot");
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return NextResponse.json(
      { error: "Please upload your payment screenshot." },
      { status: 400 }
    );
  }
  if (screenshot.size > MAX_SCREENSHOT_BYTES) {
    return NextResponse.json(
      { error: "Screenshot is too large (max 8MB)." },
      { status: 400 }
    );
  }

  const bookingRef = generateBookingRef();
  const referralCode = generateReferralCode();

  let referredBy: string | null = null;
  const incomingReferralCode = getStr("referral_code");
  if (incomingReferralCode) {
    const { data: referrer } = await supabaseAdmin
      .from("bookings")
      .select("booking_ref")
      .eq("referral_code", incomingReferralCode)
      .maybeSingle();
    if (referrer) referredBy = referrer.booking_ref;
  }

  const ext = screenshot.name.split(".").pop() || "jpg";
  const storagePath = `${bookingRef}/payment.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(PAYMENT_SCREENSHOTS_BUCKET)
    .upload(storagePath, screenshot, {
      contentType: screenshot.type || "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Couldn't upload your screenshot. Please try again." },
      { status: 500 }
    );
  }

  const { error: insertError } = await supabaseAdmin.from("bookings").insert({
    booking_ref: bookingRef,
    group_type: data.group_type,
    num_participants: data.num_participants,
    primary_name: data.primary_name,
    primary_phone: data.primary_phone,
    primary_whatsapp: data.primary_whatsapp,
    primary_instagram: data.primary_instagram,
    primary_age: data.primary_age,
    partner_name: data.partner_name || null,
    partner_phone: data.partner_phone || null,
    partner_instagram: data.partner_instagram || null,
    relationship_duration: data.relationship_duration || null,
    buddy_name: data.buddy_name || null,
    buddy_phone: data.buddy_phone || null,
    buddy_whatsapp: data.buddy_whatsapp || null,
    buddy_instagram: data.buddy_instagram || null,
    buddy_age: data.buddy_age ?? null,
    fun_answers: data.fun_answers,
    ticket_type: ticket.ticketType,
    amount: ticket.amount,
    payment_method: data.payment_method,
    payment_screenshot_url: storagePath,
    status: "pending_payment",
    referral_code: referralCode,
    referred_by: referredBy,
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Couldn't save your booking. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ booking_ref: bookingRef }, { status: 201 });
}
