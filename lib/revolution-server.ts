import "server-only";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";
import type { RevolutionMember } from "./types";

export async function listRevolutionMembers(): Promise<RevolutionMember[]> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("revolution_members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as RevolutionMember[];
}
