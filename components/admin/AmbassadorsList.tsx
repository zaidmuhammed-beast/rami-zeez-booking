"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { buildWaLink } from "@/lib/whatsapp";
import { formatDateTime } from "@/lib/format";
import type { Ambassador, AmbassadorStatus } from "@/lib/types";

const STATUSES: { value: AmbassadorStatus; label: string; active: string }[] = [
  { value: "new", label: "New", active: "bg-amber-400/20 text-amber-200 border-amber-400/50" },
  { value: "contacted", label: "Contacted", active: "bg-sky-400/20 text-sky-200 border-sky-400/50" },
  { value: "selected", label: "Selected", active: "bg-emerald-400/20 text-emerald-200 border-emerald-400/50" },
  { value: "declined", label: "Declined", active: "bg-rose-400/15 text-rose-200 border-rose-400/40" },
];

type Filter = AmbassadorStatus | "all";

export function AmbassadorsList({
  initialAmbassadors,
}: {
  initialAmbassadors: Ambassador[];
}) {
  const [rows, setRows] = useState(initialAmbassadors);
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: rows.length,
      new: 0,
      contacted: 0,
      selected: 0,
      declined: 0,
    };
    for (const r of rows) c[r.status] += 1;
    return c;
  }, [rows]);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  async function setStatus(row: Ambassador, status: AmbassadorStatus) {
    if (row.status === status) return;
    setPendingId(row.id);
    setError(null);

    // Optimistic: flip it now, roll back if the server disagrees.
    const previous = row.status;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));

    try {
      const res = await fetch(`/api/admin/ambassadors/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ambassador) {
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, status: previous } : r))
        );
        setError(data.error || "Couldn't update that application.");
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === row.id ? data.ambassador : r)));
    } catch {
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: previous } : r))
      );
      setError("Couldn't reach the server.");
    } finally {
      setPendingId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-rz-cream/60">
        Nothing yet. Applications from the Campus Ambassadors page land here.
      </GlassCard>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["all", ...STATUSES.map((s) => s.value)] as Filter[]).map((value) => {
          const label =
            value === "all" ? "All" : STATUSES.find((s) => s.value === value)!.label;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`chip text-xs transition ${
                filter === value
                  ? "border-rz-amber-400/70 bg-white/15 text-rz-cream"
                  : "text-rz-cream/65 hover:bg-white/15"
              }`}
            >
              {label} · {counts[value]}
            </button>
          );
        })}
      </div>

      {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}

      <div className="space-y-4">
        {visible.map((row) => {
          const waTarget = row.whatsapp || row.phone;
          const busy = pendingId === row.id;

          return (
            <GlassCard key={row.id} className={`p-6 ${busy ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">{row.full_name}</h2>
                  <p className="text-sm text-rz-cream/70">
                    {row.university} · {row.city}
                    {row.study_year ? ` · ${row.study_year}` : ""}
                  </p>
                </div>
                <div className="text-right text-xs text-rz-cream/50">
                  <p>{formatDateTime(row.created_at)}</p>
                  {row.follower_range && (
                    <p className="mt-1 text-rz-cream/70">
                      👥 {row.follower_range}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm text-rz-cream/80 whitespace-pre-wrap">
                {row.why}
              </p>

              {row.experience && (
                <p className="mt-3 text-sm text-rz-cream/60 whitespace-pre-wrap">
                  <span className="text-rz-cream/45">Experience: </span>
                  {row.experience}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={buildWaLink(
                    waTarget,
                    `Hi ${row.full_name}! Thanks for applying to be a campus ambassador.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:underline"
                >
                  💬 {waTarget}
                </a>
                <span className="text-rz-cream/70">📸 {row.instagram}</span>
                {row.email && (
                  <a
                    href={`mailto:${row.email}`}
                    className="text-rz-cream/70 hover:underline"
                  >
                    ✉️ {row.email}
                  </a>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-rz-cream/45 mr-1">
                  Status
                </span>
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={busy}
                    onClick={() => setStatus(row, s.value)}
                    aria-pressed={row.status === s.value}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed ${
                      row.status === s.value
                        ? s.active
                        : "border-white/15 text-rz-cream/60 hover:bg-white/10"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {visible.length === 0 && (
        <GlassCard className="p-8 text-center text-rz-cream/60">
          No applications with that status.
        </GlassCard>
      )}
    </div>
  );
}
