import type { GroupType } from "./constants";

export type FunAnswers = Partial<Record<string, string>>;

export type BookingStatus = "pending_payment" | "confirmed" | "checked_in";

export interface Booking {
  id: string;
  booking_ref: string;
  group_type: GroupType;
  num_participants: number;
  primary_name: string;
  primary_phone: string;
  primary_whatsapp: string;
  primary_instagram: string | null;
  primary_age: number | null;
  partner_name: string | null;
  partner_phone: string | null;
  partner_instagram: string | null;
  relationship_duration: string | null;
  fun_answers: FunAnswers;
  ticket_type: string;
  amount: number;
  payment_method: string;
  payment_screenshot_url: string | null;
  status: BookingStatus;
  coffee_claimed: boolean;
  quiz_number: number | null;
  table_number: string | null;
  couple_number: number | null;
  referral_code: string;
  referred_by: string | null;
  badges: string[];
  wristband_color: string | null;
  lucky_draw_token: string | null;
  created_at: string;
}

export interface CreateBookingPayload {
  group_type: GroupType;
  num_participants: number;
  primary_name: string;
  primary_phone: string;
  primary_whatsapp: string;
  primary_instagram: string;
  primary_age: number;
  partner_name?: string;
  partner_phone?: string;
  partner_instagram?: string;
  relationship_duration?: string;
  fun_answers: FunAnswers;
  ticket_type: string;
  amount: number;
  payment_method: string;
  referred_by?: string;
}
