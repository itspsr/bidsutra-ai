import { NextResponse } from "next/server";
import { getStripe, appUrl } from "@/lib/billing/stripe";
import { getAuthedProfile } from "@/lib/auth/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { org, profile } = await getAuthedProfile();
  if (!org || !profile) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
  if (!["owner", "admin"].includes(profile.role)) return NextResponse.json({ success: false, reason: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const plan = body?.plan as "pro" | "enterprise";
  if (!plan) return NextResponse.json({ success: false, reason: "missing_plan" }, { status: 400 });

  const priceId = plan === "pro" ? process.env.STRIPE_PRICE_PRO_MONTHLY : process.env.STRIPE_PRICE_ENT_MONTHLY;
  if (!priceId) return NextResponse.json({ success: false, reason: "missing_price_id" }, { status: 500 });

  const supabase = await createSupabaseServerClient();
  const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("org_id", org.id).maybeSingle();

  let customerId = sub?.stripe_customer_id || null;
  if (!customerId) {
    const stripe = getStripe();
    const customer = await stripe.customers.create({
      name: org.name,
      metadata: { org_id: org.id }
    });
    customerId = customer.id;
    await supabase.from("subscriptions").upsert({ org_id: org.id, stripe_customer_id: customerId });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: appUrl("/billing?success=1"),
    cancel_url: appUrl("/billing?canceled=1"),
    subscription_data: {
      metadata: { org_id: org.id, plan }
    }
  });

  return NextResponse.json({ success: true, url: session.url });
}
