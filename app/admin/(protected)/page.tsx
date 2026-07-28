import { listBookings } from "@/lib/bookings-server";
import { AdminTable } from "@/components/admin/AdminTable";

export default async function AdminDashboardPage() {
  const bookings = await listBookings();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-1">Bookings</h1>
      <p className="text-sm text-rz-cream/60 mb-6">
        {bookings.length} total booking{bookings.length === 1 ? "" : "s"}
      </p>
      <AdminTable initialBookings={bookings} />
    </div>
  );
}
