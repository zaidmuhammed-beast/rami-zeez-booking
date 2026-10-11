import { NextResponse } from "next/server";
import { getSlotAvailability, getShowAvailability } from "@/lib/slots";

export async function GET() {
  const [availability, shows] = await Promise.all([
    getSlotAvailability(),
    getShowAvailability(),
  ]);
  return NextResponse.json({ ...availability, shows });
}
