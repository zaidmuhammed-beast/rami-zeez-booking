import "server-only";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";
import type { Ambassador } from "./types";

export async function listAmbassadors(): Promise<Ambassador[]> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("ambassadors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Ambassador[];
}
