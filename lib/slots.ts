import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";
import { EVENT, SHOW_TIMES, type ShowTimeId } from "./constants";

type BookedRow = { num_participants: number; show_time: string | null };

export type ShowAvailability = {
  id: ShowTimeId;
  label: string;
  emoji: string;
  note: string;
  capacity: number;
  taken: number;
  remaining: number;
  soldOut: boolean;
};

async function fetchBookedRows(): Promise<BookedRow[] | null> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("num_participants, show_time");

  if (error || !data) return null;
  return data as BookedRow[];
}

/** Seats taken across the whole day. */
export async function getSlotAvailability() {
  const total = EVENT.totalSlots;
  const rows = await fetchBookedRows();
  if (!rows) return { taken: 0, total };

  const taken = rows.reduce((sum, row) => sum + row.num_participants, 0);
  return { taken, total };
}

/** Seats taken per show — each one has its own capacity. */
export async function getShowAvailability(): Promise<ShowAvailability[]> {
  const rows = await fetchBookedRows();

  return SHOW_TIMES.map((show) => {
    const taken = (rows || [])
      .filter((row) => row.show_time === show.id)
      .reduce((sum, row) => sum + row.num_participants, 0);
    const remaining = Math.max(0, show.capacity - taken);

    return {
      id: show.id,
      label: show.label,
      emoji: show.emoji,
      note: show.note,
      capacity: show.capacity,
      taken,
      remaining,
      soldOut: remaining <= 0,
    };
  });
}

/** Server-side guard: can this show still take that many seats? */
export async function canSeat(showTime: string, seats: number) {
  const shows = await getShowAvailability();
  const show = shows.find((s) => s.id === showTime);
  if (!show) return { ok: false as const, reason: "Unknown show time." };
  if (show.remaining < seats) {
    return {
      ok: false as const,
      reason:
        show.remaining === 0
          ? `The ${show.label} show is sold out. Please pick the other one.`
          : `Only ${show.remaining} seat${show.remaining === 1 ? "" : "s"} left for the ${show.label} show.`,
    };
  }
  return { ok: true as const };
}
