import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="glass border-x-0 border-t-0 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold">Rami ZeeZ Admin</span>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-full px-3 py-1.5 hover:bg-white/10 transition">
              Dashboard
            </Link>
            <Link
              href="/admin/checkin"
              className="rounded-full px-3 py-1.5 hover:bg-white/10 transition"
            >
              Check-in
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
