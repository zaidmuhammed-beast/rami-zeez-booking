import { listBrandPartners } from "@/lib/brands-server";
import { GlassCard } from "@/components/ui/GlassCard";
import { getEvent } from "@/lib/events";
import { buildWaLink } from "@/lib/whatsapp";
import { formatDateTime } from "@/lib/format";
import type { BrandInterest } from "@/lib/types";

// Admin data must always be fresh — never serve a build-time snapshot.
export const dynamic = "force-dynamic";

const INTEREST_LABEL: Record<BrandInterest, string> = {
  stall: "🏪 Stall",
  promotion: "📣 Promotion",
  both: "✨ Stall + Promotion",
};

export default async function AdminBrandsPage() {
  const brands = await listBrandPartners();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">Brand enquiries</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        {brands.length} submission{brands.length === 1 ? "" : "s"} from /brands
      </p>

      {brands.length === 0 ? (
        <GlassCard className="p-8 text-center text-rz-cream/60">
          Nothing yet. Submissions from the Partner With Us page land here.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {brands.map((brand) => {
            const waTarget = brand.whatsapp || brand.phone;
            return (
              <GlassCard key={brand.id} className="p-6">
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
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
