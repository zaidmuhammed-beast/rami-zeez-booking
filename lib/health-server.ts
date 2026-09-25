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

export type WriteCheck = {
  table: string;
  label: string;
  ok: boolean;
  /** True when the test row was written but couldn't be cleaned up. */
  leftover: boolean;
  code: string | null;
  message: string | null;
};

/**
 * Inserts a clearly-marked row and deletes it again, so we test the exact
 * path the public forms use. A read succeeding proves nothing about writes:
 * a missing column or a failed constraint only shows up on insert.
 *
 * Bookings is deliberately excluded — a stray row there would pollute the
 * slot counter and the dashboard.
 */
export async function runWriteTests(): Promise<WriteCheck[]> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return [];
  }
  const db = supabaseAdmin;

  const probes: { table: string; label: string; row: Record<string, unknown> }[] = [
    {
      table: "brand_partners",
      label: "Brand enquiries",
      row: {
        brand_name: "__health_check__",
        contact_name: "__health_check__",
        phone: "0000000000",
        category: "Other",
        interest: "stall",
        events: [],
        description: "Automated write test from /admin/health.",
      },
    },
    {
      table: "ambassadors",
      label: "Ambassador applications",
      row: {
        full_name: "__health_check__",
        university: "__health_check__",
        city: "__health_check__",
        phone: "0000000000",
        instagram: "@__health_check__",
        why: "Automated write test from /admin/health.",
      },
    },
  ];

  return Promise.all(
    probes.map(async ({ table, label, row }) => {
      const { data, error } = await db.from(table).insert(row).select("id").maybeSingle();

      if (error || !data) {
        return {
          table,
          label,
          ok: false,
          leftover: false,
          code: error?.code || null,
          message: error?.message || "Insert returned no row.",
        };
      }

      const { error: cleanupError } = await db.from(table).delete().eq("id", data.id);

      return {
        table,
        label,
        ok: true,
        leftover: Boolean(cleanupError),
        code: null,
        message: cleanupError
          ? `Wrote fine, but the test row couldn't be removed: ${cleanupError.message}`
          : null,
      };
    })
  );
}

export type KeyCheck = {
  kind: string;
  ok: boolean;
  note: string;
};

/**
 * Identifies the configured key WITHOUT revealing it. Supabase's new keys are
 * prefixed; the legacy ones are JWTs carrying a "role" claim. A publishable
 * or anon key reads happily under RLS and returns zero rows, then fails every
 * write — which looks exactly like an empty table.
 */
export function checkServiceKey(): KeyCheck {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    return {
      kind: "missing",
      ok: false,
      note: "SUPABASE_SERVICE_ROLE_KEY isn't set in the environment.",
    };
  }

  if (key.startsWith("sb_secret_")) {
    return {
      kind: "secret (new format)",
      ok: true,
      note: "Full access — bypasses row level security. Correct for server-side writes.",
    };
  }

  if (key.startsWith("sb_publishable_")) {
    return {
      kind: "publishable (new format)",
      ok: false,
      note: "This is the browser-safe key. It cannot bypass row level security, so reads return nothing and writes are rejected. Replace it with the secret key (Settings > API Keys > Secret keys).",
    };
  }

  if (key.startsWith("eyJ")) {
    // Legacy JWT — the role claim is in the unverified payload.
    try {
      const payload = JSON.parse(
        Buffer.from(key.split(".")[1], "base64").toString("utf8")
      ) as { role?: string };

      if (payload.role === "service_role") {
        return {
          kind: "legacy service_role",
          ok: true,
          note: "Full access — bypasses row level security.",
        };
      }
      return {
        kind: `legacy ${payload.role || "unknown"}`,
        ok: false,
        note: "This key can't bypass row level security, so writes are rejected. Use the service_role (or new secret) key instead.",
      };
    } catch {
      return {
        kind: "legacy JWT",
        ok: false,
        note: "Couldn't read the role from this key.",
      };
    }
  }

  return {
    kind: "unrecognised",
    ok: false,
    note: "This doesn't look like a Supabase key.",
  };
}
