import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const OrgSchema = z.object({
  name: z.string().min(2),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  msme_udyam: z.string().optional(),
  address: z.string().optional(),
  turnover_band: z.string().optional(),
  certifications: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = OrgSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, reason: "invalid-input", issues: parsed.error.flatten() }, { status: 400 });
  }

  // Ensure profile exists
  await supabase.from("users").upsert({ id: user.id, email: user.email }, { onConflict: "id" });

  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from("organizations")
      .update({ ...parsed.data })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });
    return NextResponse.json({ success: true, organization: data });
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({ owner_user_id: user.id, ...parsed.data })
    .select("*")
    .single();

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });

  // Create default subscription
  await supabase.from("subscriptions").insert({ org_id: data.id, plan: "FREE", status: "active" });

  return NextResponse.json({ success: true, organization: data });
}
