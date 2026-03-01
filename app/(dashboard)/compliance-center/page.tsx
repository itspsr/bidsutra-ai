import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function toneFor(status: string) {
  if (status === "ready") return "steel";
  if (status === "in_progress") return "neutral";
  return "gold";
}

export default async function ComplianceCenterPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Shell title="Compliance Center" subtitle="You must sign in.">
        <Card>
          <CardHeader><CardTitle>Unauthorized</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70">Please sign in to view compliance items.</CardContent>
        </Card>
      </Shell>
    );
  }

  const { data: org } = await supabase.from("organizations").select("id").eq("owner_user_id", user.id).maybeSingle();
  if (!org?.id) {
    return (
      <Shell title="Compliance Center" subtitle="Set up your organization first.">
        <Card>
          <CardHeader><CardTitle>No organization</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70">Create an organization profile to enable storage.</CardContent>
        </Card>
      </Shell>
    );
  }

  const { data: latestTender } = await supabase
    .from("tenders")
    .select("id,title,created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestTender?.id) {
    return (
      <Shell title="Compliance Center" subtitle="No tenders yet.">
        <Card>
          <CardHeader><CardTitle>Empty</CardTitle></CardHeader>
          <CardContent className="text-sm text-white/70">Create a tender to generate a checklist.</CardContent>
        </Card>
      </Shell>
    );
  }

  const { data: items } = await supabase
    .from("compliance_items")
    .select("id,label,status,notes")
    .eq("org_id", org.id)
    .eq("tender_id", latestTender.id)
    .order("created_at", { ascending: true });

  return (
    <Shell title="Compliance Center" subtitle={`Checklist for: ${latestTender.title}`}> 
      <Card>
        <CardHeader>
          <CardTitle>Mandatory Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(items ?? []).map((it) => (
            <div key={it.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-sm text-white/85 font-medium">{it.label}</div>
                {it.notes ? <div className="text-xs text-white/55 mt-0.5">{it.notes}</div> : null}
              </div>
              <Badge tone={toneFor(it.status) as any}>{String(it.status).toUpperCase()}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </Shell>
  );
}
