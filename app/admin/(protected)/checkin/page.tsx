"use client";

import dynamic from "next/dynamic";

const CheckinScanner = dynamic(
  () => import("@/components/admin/CheckinScanner").then((m) => m.CheckinScanner),
  { ssr: false }
);

export default function CheckinPage() {
  return <CheckinScanner />;
}
