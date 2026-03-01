import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthedProfile } from "@/lib/auth/profile";
import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminSystemPage() {
  const { org, profile } = await getAuthedProfile();
  if (!org || !profile) redirect("/login");
  if (!(profile.role === "owner" || profile.role === "admin")) redirect("/overview?forbidden=1");

  const supabase = await createSupabaseServerClient();

  const [orgs, tenders, subs, errors24h, webhooks24h] = await Promise.all([
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("tenders").select("id", { count: "exact", head: true }),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).in("status", ["active", "trialing", "past_due"] as any),
    supabase
      .from("error_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  ]);

  return (
    <Shell title="Admin • System" subtitle="Monitoring panel (RLS-scoped; aggregate counts).">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-3">
          <CardHeader><CardTitle>Organizations</CardTitle><CardDescription>Total</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-semibold num">{orgs.count ?? 0}</div></CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader><CardTitle>Tenders</CardTitle><CardDescription>Total</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-semibold num">{tenders.count ?? 0}</div></CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader><CardTitle>Active Subs</CardTitle><CardDescription>Active/trialing/past_due</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-semibold num">{subs.count ?? 0}</div></CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader><CardTitle>Errors</CardTitle><CardDescription>Last 24h</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-semibold num">{errors24h.count ?? 0}</div></CardContent>
        </Card>

        <Card className="col-span-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Stripe Webhooks</CardTitle>
                <CardDescription>Last 24h ingest volume</CardDescription>
              </div>
              <Badge tone="teal">Idempotent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold num">{webhooks24h.count ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
