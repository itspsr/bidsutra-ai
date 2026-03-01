import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RiskGauge } from "@/components/ui/risk-gauge";

export const dynamic = "force-dynamic";

export default async function RiskBreakdownPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Shell title="Risk Breakdown" subtitle="You must sign in.">
        <Card>
          <CardHeader><CardTitle>Unauthorized</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70">Please sign in to view risk.</CardContent>
        </Card>
      </Shell>
    );
  }

  const { data: org } = await supabase.from("organizations").select("id").eq("owner_user_id", user.id).maybeSingle();
  if (!org?.id) {
    return (
      <Shell title="Risk Breakdown" subtitle="Set up your organization first.">
        <Card>
          <CardHeader><CardTitle>No organization</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70">Create an organization profile to enable scoring.</CardContent>
        </Card>
      </Shell>
    );
  }

  const { data: latest } = await supabase
    .from("risk_scores")
    .select("score,level,drivers,created_at,tender_id")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) {
    return (
      <Shell title="Risk Breakdown" subtitle="No risk score yet.">
        <Card>
          <CardHeader><CardTitle>Empty</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70">Create a tender to generate a risk score.</CardContent>
        </Card>
      </Shell>
    );
  }

  const drivers = latest.drivers as any;

  return (
    <Shell title="Risk Breakdown" subtitle={`Latest score: ${latest.level} (${latest.score}/100)`}>
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-4">
          <CardHeader><CardTitle>Risk Gauge</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <RiskGauge value={latest.score} label={latest.level} />
          </CardContent>
        </Card>

        <Card className="col-span-8">
          <CardHeader><CardTitle>Drivers</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70 space-y-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div><b className="text-white/85">Deadline present:</b> {String(drivers?.deadline ?? false)}</div>
              <div><b className="text-white/85">Tender text available:</b> {String(drivers?.hasRawText ?? false)}</div>
              <div><b className="text-white/85">Estimated value (Cr):</b> {String(drivers?.estValueCr ?? 0)}</div>
              <div><b className="text-white/85">Org completeness:</b> {String(drivers?.orgCompleteness ?? 0)}%</div>
            </div>
            <div className="text-xs text-white/55">
              This is a deterministic server-side scoring baseline. You can layer AI extraction later.
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
