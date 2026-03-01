import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrgContext } from "@/lib/auth";
import { scoreRiskTotal } from "@/lib/risk-v2";

export const dynamic = "force-dynamic";

const Body = z.object({
  eligibility: z.number().min(0).max(100),
  financial: z.number().min(0).max(100),
  penalty: z.number().min(0).max(100),
  experience: z.number().min(0).max(100),
  deadline: z.number().min(0).max(100)
});

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { supabase, user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const tenderId = ctx.params.id;
  const body = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, reason: "invalid_input" }, { status: 400 });

  const total = scoreRiskTotal(parsed.data);

  // Ensure tender belongs to org
  const { data: tender } = await supabase.from("tenders").select("id, org_id").eq("id", tenderId).maybeSingle();
  if (!tender?.id) return NextResponse.json({ success: false, reason: "not_found" }, { status: 404 });

  await supabase.from("tenders").update({ risk_score: total }).eq("id", tenderId);
  await supabase
    .from("risk_scores")
    .upsert({ tender_id: tenderId, ...parsed.data, total }, { onConflict: "tender_id" });

  return NextResponse.json({ success: true, total });
}
