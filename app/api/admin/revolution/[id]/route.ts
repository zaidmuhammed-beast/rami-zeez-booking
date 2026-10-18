import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import type { RevolutionStatus } from "@/lib/types";

const ALLOWED_STATUSES = new Set<RevolutionStatus>([
  "new",
  "contacted",
  "approved",
  "declined",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const status = body.status;
  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES.has(status as RevolutionStatus)
  ) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("revolution_members")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Couldn't update this submission." },
      { status: 500 }
    );
  }

  return NextResponse.json({ member: data });
}
