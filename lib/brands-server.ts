import "server-only";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";
import type { BrandPartner } from "./types";

export async function listBrandPartners(): Promise<BrandPartner[]> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("brand_partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as BrandPartner[];
}
