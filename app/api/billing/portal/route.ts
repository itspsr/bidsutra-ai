import { NextResponse } from "next/server";
import { getStripe, appUrl } from "@/lib/billing/stripe";
import { getAuthedProfile } from "@/lib/auth/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const { org, profile } = await getAuthedProfile();
  if (!org || !profile) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
  if (!["owner", "admin"].includes(profile.role)) return NextResponse.json({ success: false, reason: "forbidden" }, { status: 403 });

  const supabase = await createSupabaseServerClient();
  const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("org_id", org.id).maybeSingle();
  if (!sub?.stripe_customer_id) return NextResponse.json({ success: false, reason: "no_customer" }, { status: 400 });

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: appUrl("/billing")
  });

  return NextResponse.json({ success: true, url: portal.url });
}
