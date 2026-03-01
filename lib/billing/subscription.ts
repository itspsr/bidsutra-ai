import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSubscriptionStatus(orgId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("subscriptions").select("status, stripe_customer_id, stripe_subscription_id").eq("org_id", orgId).maybeSingle();
  return data;
}
