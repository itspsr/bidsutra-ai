import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("id,email,full_name,phone").eq("id", user.id).maybeSingle();
  const { data: org } = await supabase.from("organizations").select("*").eq("owner_user_id", user.id).maybeSingle();

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email }, profile, organization: org });
}
