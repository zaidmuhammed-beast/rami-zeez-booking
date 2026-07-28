import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";
import { EVENT } from "./constants";

export async function getSlotAvailability() {
  const total = EVENT.totalSlots;

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { taken: 0, total };
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("num_participants");

  if (error || !data) {
    return { taken: 0, total };
  }

  const taken = data.reduce(
    (sum, row: { num_participants: number }) => sum + row.num_participants,
    0
  );

  return { taken, total };
}
