import "server-only";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";
import type { Booking } from "./types";

export async function getBookingByRef(ref: string): Promise<Booking | null> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("booking_ref", ref)
    .maybeSingle();

  if (error || !data) return null;
  return data as Booking;
}

export async function listBookings(): Promise<Booking[]> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Booking[];
}
