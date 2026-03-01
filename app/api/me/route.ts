import { NextResponse } from "next/server";
import { requireOrgContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, profile, org } = await requireOrgContext();
  if (!user) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, user: { id: user.id, email: user.email }, profile, org });
}
