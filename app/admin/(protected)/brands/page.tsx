import { listBrandPartners } from "@/lib/brands-server";
import { BrandsList } from "@/components/admin/BrandsList";

// Admin data must always be fresh — never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await listBrandPartners();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">Brand enquiries</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        {brands.length} submission{brands.length === 1 ? "" : "s"} from /brands
      </p>
      <BrandsList initialBrands={brands} />
    </div>
  );
}
