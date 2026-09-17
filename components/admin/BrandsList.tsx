"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getEvent } from "@/lib/events";
import { buildWaLink } from "@/lib/whatsapp";
import { formatDateTime } from "@/lib/format";
import type { BrandInterest, BrandPartner, BrandStatus } from "@/lib/types";

const INTEREST_LABEL: Record<BrandInterest, string> = {
  stall: "🏪 Stall",
  promotion: "📣 Promotion",
  both: "✨ Stall + Promotion",
};

const STATUSES: { value: BrandStatus; label: string; active: string }[] = [
  { value: "new", label: "New", active: "bg-amber-400/20 text-amber-200 border-amber-400/50" },
  { value: "contacted", label: "Contacted", active: "bg-sky-400/20 text-sky-200 border-sky-400/50" },
  { value: "confirmed", label: "Confirmed", active: "bg-emerald-400/20 text-emerald-200 border-emerald-400/50" },
  { value: "declined", label: "Declined", active: "bg-rose-400/15 text-rose-200 border-rose-400/40" },
];

type Filter = BrandStatus | "all";

export function BrandsList({ initialBrands }: { initialBrands: BrandPartner[] }) {
  const [brands, setBrands] = useState(initialBrands);
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: brands.length,
      new: 0,
      contacted: 0,
      confirmed: 0,
      declined: 0,
    };
    for (const b of brands) c[b.status] += 1;
    return c;
  }, [brands]);

  const visible = useMemo(
    () => (filter === "all" ? brands : brands.filter((b) => b.status === filter)),
    [brands, filter]
  );

  async function setStatus(brand: BrandPartner, status: BrandStatus) {
    if (brand.status === status) return;
    setPendingId(brand.id);
    setError(null);

    // Optimistic: flip it now, roll back if the server disagrees.
    const previous = brand.status;
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, status } : b))
    );

    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.brand) {
        setBrands((prev) =>
          prev.map((b) => (b.id === brand.id ? { ...b, status: previous } : b))
        );
        setError(data.error || "Couldn't update that enquiry.");
        return;
      }
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? data.brand : b)));
    } catch {
      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, status: previous } : b))
      );
      setError("Couldn't reach the server.");
    } finally {
      setPendingId(null);
    }
  }

  if (brands.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-rz-cream/60">
        Nothing yet. Submissions from the Partner With Us page land here.
      </GlassCard>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["all", ...STATUSES.map((s) => s.value)] as Filter[]).map((value) => {
          const label =
            value === "all"
              ? "All"
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
        {visible.map((brand) => {
          const waTarget = brand.whatsapp || brand.phone;
          const busy = pendingId === brand.id;

          return (
            <GlassCard key={brand.id} className={`p-6 ${busy ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">
                    {brand.brand_name}
                  </h2>
                  <p className="text-sm text-rz-cream/70">
                    {brand.contact_name} · {brand.category}
                  </p>
                </div>
                <div className="text-right text-xs text-rz-cream/50">
                  <p>{formatDateTime(brand.created_at)}</p>
                  <p className="mt-1 text-rz-cream/70">
                    {INTEREST_LABEL[brand.interest]}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-rz-cream/80 whitespace-pre-wrap">
                {brand.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {brand.events.map((slug) => (
                  <span key={slug} className="chip text-xs">
                    {getEvent(slug)?.name || slug}
                  </span>
                ))}
                {brand.budget && (
                  <span className="chip text-xs">💰 {brand.budget}</span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={buildWaLink(
                    waTarget,
                    `Hi ${brand.contact_name}! Thanks for reaching out about ${brand.brand_name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:underline"
                >
                  💬 {waTarget}
                </a>
                {brand.email && (
                  <a
                    href={`mailto:${brand.email}`}
                    className="text-rz-cream/70 hover:underline"
                  >
                    ✉️ {brand.email}
                  </a>
                )}
                {brand.instagram && (
                  <span className="text-rz-cream/70">📸 {brand.instagram}</span>
                )}
                {brand.website && (
                  <span className="text-rz-cream/70">🔗 {brand.website}</span>
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
                    onClick={() => setStatus(brand, s.value)}
                    aria-pressed={brand.status === s.value}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed ${
                      brand.status === s.value
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
          No enquiries with that status.
        </GlassCard>
      )}
    </div>
  );
}
