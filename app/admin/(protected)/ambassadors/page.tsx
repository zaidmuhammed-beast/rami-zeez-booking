import { listAmbassadors } from "@/lib/ambassadors-server";
import { AmbassadorsList } from "@/components/admin/AmbassadorsList";

// Admin data must always be fresh — never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AdminAmbassadorsPage() {
  const ambassadors = await listAmbassadors();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">Ambassadors</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        {ambassadors.length} application
        {ambassadors.length === 1 ? "" : "s"} from /ambassadors
      </p>
      <AmbassadorsList initialAmbassadors={ambassadors} />
    </div>
  );
}
