import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/billing/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return new NextResponse("Missing signature/secret", { status: 400 });

  const body = await req.text();
  const stripe = getStripe();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const orgId = sub.metadata?.org_id as string | undefined;
      const plan = (sub.metadata?.plan as string | undefined) ?? undefined;
      if (orgId) {
        await supabase.from("subscriptions").upsert({
          org_id: orgId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status
        });
        if (plan) {
          const nextPlan = plan === "enterprise" ? "enterprise" : "pro";
          await supabase.from("organizations").update({ plan: nextPlan }).eq("id", orgId);
        }
      }
      break;
    }
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const customerId = session.customer as string | undefined;
      const subId = session.subscription as string | undefined;
      if (customerId && subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        const orgId = (sub.metadata?.org_id as string | undefined) ?? undefined;
        const plan = (sub.metadata?.plan as string | undefined) ?? undefined;
        if (orgId) {
          await supabase.from("subscriptions").upsert({
            org_id: orgId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            status: sub.status
          });
          if (plan) {
            const nextPlan = plan === "enterprise" ? "enterprise" : "pro";
            await supabase.from("organizations").update({ plan: nextPlan }).eq("id", orgId);
          }
        }
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
