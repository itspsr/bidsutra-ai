import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const tenderId = ctx.params.id;

  const { data: org } = await supabase.from("organizations").select("id").eq("owner_user_id", user.id).maybeSingle();
  if (!org?.id) return NextResponse.json({ success: false, reason: "no-organization" }, { status: 400 });

  const { data, error } = await supabase
    .from("risk_scores")
    .select("score,level,drivers,created_at")
    .eq("org_id", org.id)
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });

  return NextResponse.json({ success: true, risk: data ?? null });
}
