import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { scoreTenderRisk } from "@/lib/risk";

export const dynamic = "force-dynamic";

const TenderCreateSchema = z.object({
  title: z.string().min(4),
  department: z.string().optional(),
  state: z.string().optional(),
  deadline: z.string().optional(), // YYYY-MM-DD
  est_value_cr: z.number().optional(),
  raw_text: z.string().optional()
});

export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const { data: org } = await supabase.from("organizations").select("id").eq("owner_user_id", user.id).maybeSingle();
  if (!org?.id) return NextResponse.json({ success: false, reason: "no-organization" }, { status: 400 });

  const { data, error } = await supabase
    .from("tenders")
    .select("id,title,department,state,deadline,est_value_cr,created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });
  return NextResponse.json({ success: true, tenders: data ?? [] });
}

export async function POST(req: Request) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const { data: org } = await supabase.from("organizations").select("*").eq("owner_user_id", user.id).maybeSingle();
  if (!org?.id) return NextResponse.json({ success: false, reason: "no-organization" }, { status: 400 });

  const body = await req.json();
  const parsed = TenderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, reason: "invalid-input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const tenderPayload = {
    org_id: org.id,
    source: "upload",
    title: parsed.data.title,
    department: parsed.data.department ?? null,
    state: parsed.data.state ?? null,
    deadline: parsed.data.deadline ?? null,
    est_value_cr: parsed.data.est_value_cr ?? null,
    raw_text: parsed.data.raw_text ?? null
  };

  const { data: tender, error: tenderErr } = await supabase.from("tenders").insert(tenderPayload).select("*").single();
  if (tenderErr) return NextResponse.json({ success: false, reason: tenderErr.message }, { status: 500 });

  // org completeness heuristic
  const completeness = [org.gstin, org.pan, org.msme_udyam, org.address, org.turnover_band].filter(Boolean).length;
  const orgCompleteness = Math.round((completeness / 5) * 100);

  const risk = scoreTenderRisk({
    deadline: tender.deadline,
    hasRawText: Boolean(tender.raw_text && tender.raw_text.length > 50),
    estValueCr: tender.est_value_cr,
    orgCompleteness
  });

  const { error: riskErr } = await supabase.from("risk_scores").insert({
    tender_id: tender.id,
    org_id: org.id,
    score: risk.score,
    level: risk.level,
    drivers: risk.drivers
  });

  if (riskErr) return NextResponse.json({ success: false, reason: riskErr.message }, { status: 500 });

  // Create a starter compliance checklist
  const items = [
    "GST Certificate",
    "PAN Card",
    "MSME/Udyam (if applicable)",
    "Work Orders + Completion Certificates",
    "Turnover Proof (CA Certificate)",
    "Bid Undertaking / Annexures"
  ].map((label) => ({ tender_id: tender.id, org_id: org.id, label, status: "missing" }));

  await supabase.from("compliance_items").insert(items);

  return NextResponse.json({ success: true, tender_id: tender.id, risk });
}
