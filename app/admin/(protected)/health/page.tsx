import Link from "next/link";
import {
  checkTables,
  checkBucket,
  explain,
  runWriteTests,
  checkServiceKey,
} from "@/lib/health-server";
import { GlassCard } from "@/components/ui/GlassCard";

// Always probe live — a cached result would defeat the point.
export const dynamic = "force-dynamic";

export default async function AdminHealthPage({
  searchParams,
}: {
  searchParams: Promise<{ write?: string }>;
}) {
  const { write } = await searchParams;
  const runWrites = write === "1";

  const [tables, bucket, writes] = await Promise.all([
    checkTables(),
    checkBucket(),
    runWrites ? runWriteTests() : Promise.resolve([]),
  ]);
  const broken = tables.filter((t) => !t.ok);
  const key = checkServiceKey();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">System check</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        Live check of everything the site writes to. Run this when a form
        won&apos;t submit.
      </p>

      {broken.length === 0 && bucket.ok ? (
        <GlassCard className="p-5 mb-6 border-emerald-400/30">
          <p className="font-semibold text-emerald-300">
            ✅ Everything is connected
          </p>
          <p className="mt-1 text-sm text-rz-cream/70">
            All tables and the screenshots bucket are reachable.
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="p-5 mb-6 border-rose-400/30">
          <p className="font-semibold text-rose-300">
            ⚠️ {broken.length + (bucket.ok ? 0 : 1)} problem
            {broken.length + (bucket.ok ? 0 : 1) === 1 ? "" : "s"} found
          </p>
          <p className="mt-1 text-sm text-rz-cream/70">
            Submissions to anything listed below are failing right now.
          </p>
        </GlassCard>
      )}

      <GlassCard className={`p-5 mb-6 ${key.ok ? "" : "border-rose-400/30"}`}>
        <p className="font-semibold">
          {key.ok ? "✅" : "❌"} Database key: {key.kind}
        </p>
        <p className="mt-1 text-sm text-rz-cream/70">{key.note}</p>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <p className="font-semibold">Write test</p>
        <p className="mt-1 text-sm text-rz-cream/70">
          The checks below only read. This writes a marked row to the two form
          tables and deletes it again — the exact path a submission takes.
        </p>

        {writes.length === 0 ? (
          <Link href="/admin/health?write=1" className="btn-ghost mt-4 text-sm">
            ▶ Run write test
          </Link>
        ) : (
          <div className="mt-4 space-y-3">
            {writes.map((w) => (
              <div key={w.table} className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                <p className="font-semibold text-sm">
                  {w.ok ? "✅" : "❌"} {w.label}
                </p>
                {w.ok && !w.leftover && (
                  <p className="mt-1 text-xs text-rz-cream/60">
                    Wrote and cleaned up. Submissions to this form will save.
                  </p>
                )}
                {w.message && (
                  <p className="mt-2 text-xs text-rz-cream/70 font-mono break-words">
                    {w.code ? `${w.code}: ` : ""}
                    {w.message}
                  </p>
                )}
                {w.leftover && (
                  <p className="mt-2 text-xs text-amber-200">
                    👉 Delete the __health_check__ row from {w.table} by hand.
                  </p>
                )}
              </div>
            ))}
            <Link href="/admin/health" className="btn-ghost mt-2 text-sm">
              ↺ Back to read-only check
            </Link>
          </div>
        )}
      </GlassCard>

      <div className="space-y-3">
        {tables.map((check) => {
          const fix = explain(check);
          return (
            <GlassCard key={check.table} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {check.ok ? "✅" : "❌"} {check.label}
                  </p>
                  <p className="text-xs text-rz-cream/50 mt-0.5">
                    table: {check.table}
                  </p>
                </div>
                {check.ok && (
                  <span className="chip text-xs">
                    {check.rows ?? 0} row{check.rows === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {!check.ok && (
                <div className="mt-3 space-y-2">
                  {fix && (
                    <p className="text-sm text-amber-200">👉 {fix}</p>
                  )}
                  <p className="text-xs text-rz-cream/60 font-mono break-words">
                    {check.code ? `${check.code}: ` : ""}
                    {check.message}
                  </p>
                </div>
              )}
            </GlassCard>
          );
        })}

        <GlassCard className="p-5">
          <p className="font-semibold">
            {bucket.ok ? "✅" : "❌"} Payment screenshots storage
          </p>
          {!bucket.ok && (
            <p className="mt-2 text-xs text-rz-cream/60 font-mono break-words">
              {bucket.message}
            </p>
          )}
        </GlassCard>
      </div>

      <p className="mt-6 text-xs text-rz-cream/45">
        Just created a table and still seeing an error? Supabase caches its
        schema for a moment — run{" "}
        <span className="font-mono">NOTIFY pgrst, &apos;reload schema&apos;;</span>{" "}
        in the SQL editor, then reload this page.
      </p>
    </div>
  );
}
