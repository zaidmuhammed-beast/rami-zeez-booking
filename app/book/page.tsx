import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { EVENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Book Your Spot — ${EVENT.name}`,
};

export default function BookPage() {
  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  );
}
