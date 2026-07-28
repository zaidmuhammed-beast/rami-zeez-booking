import { NextResponse } from "next/server";
import { getSlotAvailability } from "@/lib/slots";

export async function GET() {
  const availability = await getSlotAvailability();
  return NextResponse.json(availability);
}
