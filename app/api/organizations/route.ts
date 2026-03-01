import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrgContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

const OrgUpdate = z.object({
  name: z.string().min(2)
});

export async function GET() {
  const { user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, organization: org, role: profile.role });
}

export async function PATCH(req: Request) {
  const { supabase, user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
  if (!(profile.role === "owner" || profile.role === "admin")) return NextResponse.json({ success: false, reason: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = OrgUpdate.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, reason: "invalid_input" }, { status: 400 });

  const { data, error } = await supabase.from("organizations").update({ name: parsed.data.name }).eq("id", org.id).select("id,name,plan,created_at").single();
  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });

  return NextResponse.json({ success: true, organization: data });
}
