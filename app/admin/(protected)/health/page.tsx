import { checkTables, checkBucket, explain } from "@/lib/health-server";
import { GlassCard } from "@/components/ui/GlassCard";

// Always probe live — a cached result would defeat the point.
export const dynamic = "force-dynamic";

export default async function AdminHealthPage() {
  const [tables, bucket] = await Promise.all([checkTables(), checkBucket()]);
  const broken = tables.filter((t) => !t.ok);

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
