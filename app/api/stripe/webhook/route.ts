import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/billing/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger, requestContext } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ctx = requestContext(req);

  const rl = enforceRateLimit({ scope: "stripe.webhook", ip: ctx.ip, requestId: ctx.request_id, path: ctx.path });
  if (!rl.ok) return new NextResponse("rate_limited", { status: 429 });

  const sig = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    logger.warn({ scope: "stripe.webhook", message: "missing_signature_or_secret", meta: {}, ...ctx });
    return new NextResponse("Missing signature/secret", { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripe();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    logger.warn({ scope: "stripe.webhook", message: "invalid_signature", meta: {}, ...ctx });
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // Idempotency: store every event by event_id
  const eventId = event.id as string;
  const { data: existing } = await supabase.from("webhook_events").select("id, status").eq("event_id", eventId).maybeSingle();
  if (existing?.id) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await supabase.from("webhook_events").insert({
    event_id: eventId,
    provider: "stripe",
    type: event.type,
    status: "received",
    created_at: new Date().toISOString()
  });

  try {
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

          await supabase.from("activity_logs").insert({ org_id: orgId, action: `subscription.update:${sub.status}` });
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

            await supabase.from("activity_logs").insert({ org_id: orgId, action: `checkout.completed:${sub.status}` });
          }
        }
        break;
      }

      default:
        break;
    }

    await supabase
      .from("webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("event_id", eventId);

    return NextResponse.json({ received: true });
  } catch (e: any) {
    await supabase
      .from("webhook_events")
      .update({ status: "failed", error: e?.message ?? "unknown", processed_at: new Date().toISOString() })
      .eq("event_id", eventId);

    logger.error({ scope: "stripe.webhook", message: "handler_failed", meta: { type: event.type, event_id: eventId, error: e?.message }, ...ctx });
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
