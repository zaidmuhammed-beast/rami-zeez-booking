"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { buildWaLink } from "@/lib/whatsapp";
import { formatDateTime } from "@/lib/format";
import type { RevolutionMember, RevolutionRole, RevolutionStatus } from "@/lib/types";

const ROLE_LABEL: Record<RevolutionRole, string> = {
  receive: "🤲 Needs support",
  provide: "💛 Offering support",
  both: "🤝 Both",
};

const STATUSES: { value: RevolutionStatus; label: string; active: string }[] = [
  { value: "new", label: "New", active: "bg-amber-400/20 text-amber-200 border-amber-400/50" },
  { value: "contacted", label: "Contacted", active: "bg-sky-400/20 text-sky-200 border-sky-400/50" },
  { value: "approved", label: "Approved", active: "bg-emerald-400/20 text-emerald-200 border-emerald-400/50" },
  { value: "declined", label: "Declined", active: "bg-rose-400/15 text-rose-200 border-rose-400/40" },
];

type Filter = RevolutionStatus | "all" | "receive" | "provide";

export function RevolutionList({
  initialMembers,
}: {
  initialMembers: RevolutionMember[];
}) {
  const [rows, setRows] = useState(initialMembers);
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: rows.length,
      new: 0,
      contacted: 0,
      approved: 0,
      declined: 0,
      receive: 0,
      provide: 0,
    };
    for (const r of rows) {
      c[r.status] += 1;
      if (r.role === "receive" || r.role === "both") c.receive += 1;
      if (r.role === "provide" || r.role === "both") c.provide += 1;
    }
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "receive")
      return rows.filter((r) => r.role === "receive" || r.role === "both");
    if (filter === "provide")
      return rows.filter((r) => r.role === "provide" || r.role === "both");
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  async function setStatus(row: RevolutionMember, status: RevolutionStatus) {
    if (row.status === status) return;
    setPendingId(row.id);
    setError(null);

    // Optimistic: flip it now, roll back if the server disagrees.
    const previous = row.status;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));

    try {
      const res = await fetch(`/api/admin/revolution/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.member) {
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, status: previous } : r))
        );
        setError(data.error || "Couldn't update that submission.");
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === row.id ? data.member : r)));
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
        Nothing yet. Submissions from the Become Part Of Revolution page land
        here.
      </GlassCard>
    );
  }

  const filters: Filter[] = [
    "all",
    "receive",
    "provide",
    ...STATUSES.map((s) => s.value),
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((value) => {
          const label =
            value === "all"
              ? "All"
              : value === "receive"
              ? "🤲 Needs support"
              : value === "provide"
              ? "💛 Offering"
              : STATUSES.find((s) => s.value === value)!.label;
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
          const busy = pendingId === row.id;
          const waTarget = row.whatsapp || row.phone;

          return (
            <GlassCard key={row.id} className={`p-6 ${busy ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">{row.full_name}</h2>
                  <p className="text-sm text-rz-cream/70">
                    {row.city} · {row.age_range} · {row.gender}
                  </p>
                </div>
                <div className="text-right text-xs text-rz-cream/50">
                  <p>{formatDateTime(row.created_at)}</p>
                  <p className="mt-1 text-rz-cream/70">{ROLE_LABEL[row.role]}</p>
                </div>
              </div>

              {(row.role === "receive" || row.role === "both") && (
                <div className="mt-4 rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-rz-cream/45">
                    Asking for
                  </p>
                  <p className="font-semibold mt-1">{row.support_type || "—"}</p>
                  <p className="mt-2 text-xs text-rz-cream/60">
                    {row.household_size ? `${row.household_size} dependants` : ""}
                    {row.household_size && row.household_income ? " · " : ""}
                    {row.household_income || ""}
                  </p>
                  {row.situation && (
                    <p className="mt-3 text-sm text-rz-cream/80 whitespace-pre-wrap">
                      {row.situation}
                    </p>
                  )}
                </div>
              )}

              {row.contributions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-rz-cream/45 mb-2">
                    Can offer
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {row.contributions.map((c) => (
                      <span key={c} className="chip text-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {row.message && (
                <p className="mt-4 text-sm text-rz-cream/60 whitespace-pre-wrap">
                  <span className="text-rz-cream/45">Note: </span>
                  {row.message}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={buildWaLink(
                    waTarget,
                    `Hi ${row.full_name}! Thanks for reaching out — we've read your form.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:underline"
                >
                  💬 {waTarget}
                </a>
                {row.email && (
                  <a href={`mailto:${row.email}`} className="text-rz-cream/70 hover:underline">
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
          Nothing matches that filter.
        </GlassCard>
      )}
    </div>
  );
}
