import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrgContext } from "@/lib/auth";
import { planTenderLimitPerMonth } from "@/lib/auth/guards";
import { countTendersThisMonth } from "@/lib/db/usage";
import { scoreRiskTotal } from "@/lib/risk-v2";

export const dynamic = "force-dynamic";

const TenderCreateSchema = z.object({
  title: z.string().min(4),
  authority: z.string().optional(),
  status: z.enum(["draft", "active", "submitted", "won", "lost", "archived"]).optional(),
  risk: z
    .object({
      eligibility: z.number().min(0).max(100),
      financial: z.number().min(0).max(100),
      penalty: z.number().min(0).max(100),
      experience: z.number().min(0).max(100),
      deadline: z.number().min(0).max(100)
    })
    .optional()
});

export async function GET() {
  const { supabase, user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("tenders")
    .select("id, title, authority, risk_score, status, created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });
  return NextResponse.json({ success: true, tenders: data ?? [] });
}

export async function POST(req: Request) {
  const { supabase, user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const limit = planTenderLimitPerMonth[org.plan as keyof typeof planTenderLimitPerMonth];
  if (Number.isFinite(limit)) {
    const used = await countTendersThisMonth(org.id);
    if (used >= limit) {
      return NextResponse.json({ success: false, reason: "plan_limit_reached", meta: { used, limit, plan: org.plan } }, { status: 402 });
    }
  }

  const body = await req.json().catch(() => ({}));
  const parsed = TenderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, reason: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const r = parsed.data.risk ?? {
    eligibility: 60,
    financial: 55,
    penalty: 70,
    experience: 58,
    deadline: 62
  };

  const total = scoreRiskTotal(r);

  const { data: tender, error: tenderErr } = await supabase
    .from("tenders")
    .insert({
      org_id: org.id,
      title: parsed.data.title,
      authority: parsed.data.authority ?? null,
      risk_score: total,
      status: parsed.data.status ?? "draft"
    })
    .select("id, title, authority, risk_score, status, created_at")
    .single();

  if (tenderErr || !tender) return NextResponse.json({ success: false, reason: tenderErr?.message ?? "insert_failed" }, { status: 500 });

  await supabase.from("risk_scores").insert({
    tender_id: tender.id,
    eligibility: r.eligibility,
    financial: r.financial,
    penalty: r.penalty,
    experience: r.experience,
    deadline: r.deadline,
    total
  });

  await supabase.from("compliance_items").insert([
    { tender_id: tender.id, label: "GST Certificate", required: true },
    { tender_id: tender.id, label: "PAN Card", required: true },
    { tender_id: tender.id, label: "Work Orders + Completion Certificates", required: true },
    { tender_id: tender.id, label: "Turnover Proof (CA Certificate)", required: true },
    { tender_id: tender.id, label: "Bid Undertaking / Annexures", required: true }
  ]);

  await supabase.from("activity_logs").insert({ org_id: org.id, action: `tender.create:${tender.id}` });

  return NextResponse.json({ success: true, tender });
}
