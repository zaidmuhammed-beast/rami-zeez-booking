import "server-only";
import { supabaseAdmin, isSupabaseAdminConfigured, PAYMENT_SCREENSHOTS_BUCKET } from "./supabase-admin";

export type TableCheck = {
  table: string;
  label: string;
  migration: string;
  ok: boolean;
  rows: number | null;
  code: string | null;
  message: string | null;
};

const TABLES: { table: string; label: string; migration: string }[] = [
  { table: "bookings", label: "Bookings", migration: "supabase/schema.sql" },
  {
    table: "brand_partners",
    label: "Brand enquiries",
    migration: "supabase/brand_partners_migration.sql",
  },
  {
    table: "ambassadors",
    label: "Ambassador applications",
    migration: "supabase/ambassadors_migration.sql",
  },
];

/** Reads each table the site writes to and reports exactly why any of them fail. */
export async function checkTables(): Promise<TableCheck[]> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return TABLES.map((t) => ({
      ...t,
      ok: false,
      rows: null,
      code: "NO_CREDENTIALS",
      message:
        "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from the environment.",
    }));
  }

  const db = supabaseAdmin;

  return Promise.all(
    TABLES.map(async (t) => {
      const { count, error } = await db
        .from(t.table)
        .select("*", { count: "exact", head: true });

      return {
        ...t,
        ok: !error,
        rows: count ?? null,
        code: error?.code || null,
        message: error?.message || null,
      };
    })
  );
}

export type BucketCheck = {
  ok: boolean;
  message: string;
};

/** The payment screenshots bucket — bookings fail at upload without it. */
export async function checkBucket(): Promise<BucketCheck> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { ok: false, message: "Supabase credentials missing." };
  }

  const { data, error } = await supabaseAdmin.storage.listBuckets();
  if (error) return { ok: false, message: error.message };

  const found = data?.some((b) => b.id === PAYMENT_SCREENSHOTS_BUCKET);
  return found
    ? { ok: true, message: `Bucket "${PAYMENT_SCREENSHOTS_BUCKET}" is present.` }
    : {
        ok: false,
        message: `Bucket "${PAYMENT_SCREENSHOTS_BUCKET}" not found — booking screenshot uploads will fail.`,
      };
}

/** Postgres and PostgREST codes we can turn into a plain-English next step. */
export function explain(check: TableCheck): string | null {
  if (check.ok) return null;
  switch (check.code) {
    case "NO_CREDENTIALS":
      return "Add the Supabase keys to your Vercel environment variables and redeploy.";
    case "42P01":
    case "PGRST205":
      return `The table doesn't exist. Run ${check.migration} in the Supabase SQL editor.`;
    case "PGRST204":
      return `The table exists but a column is missing. Re-run ${check.migration}.`;
    case "42501":
      return "Permission denied — check you're using the service role key, not the anon key.";
    default:
      return null;
  }
}
