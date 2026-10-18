import { listRevolutionMembers } from "@/lib/revolution-server";
import { RevolutionList } from "@/components/admin/RevolutionList";

// Admin data must always be fresh — never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AdminRevolutionPage() {
  const members = await listRevolutionMembers();
  const asking = members.filter(
    (m) => m.role === "receive" || m.role === "both"
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">Revolution</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        {members.length} submission{members.length === 1 ? "" : "s"} ·{" "}
        {asking} asking for support
      </p>
      <RevolutionList initialMembers={members} />
    </div>
  );
}
