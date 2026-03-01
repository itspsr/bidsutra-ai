import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthedProfile } from "@/lib/auth/profile";
import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, THead, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const { org, profile } = await getAuthedProfile();
  if (!org || !profile) redirect("/login");
  if (!(profile.role === "owner" || profile.role === "admin")) redirect("/overview?forbidden=1");

  const supabase = await createSupabaseServerClient();
  const { data: logs } = await supabase
    .from("activity_logs")
    .select("id, action, created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: errors } = await supabase
    .from("error_logs")
    .select("id, scope, message, level, created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Shell title="Admin • Logs" subtitle="Audit trail + error telemetry (org-scoped).">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Latest 200 events</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Time</TH>
                  <TH>Action</TH>
                </TR>
              </THead>
              <tbody>
                {(logs ?? []).map((l) => (
                  <TR key={l.id}>
                    <TD className="text-text-2 num">{new Date(l.created_at).toLocaleString()}</TD>
                    <TD className="text-text-1/90">{l.action}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Errors</CardTitle>
            <CardDescription>Latest 100</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Lvl</TH>
                  <TH>Scope</TH>
                  <TH>Message</TH>
                </TR>
              </THead>
              <tbody>
                {(errors ?? []).map((e) => (
                  <TR key={e.id}>
                    <TD>
                      <Badge tone={e.level === "error" ? "critical" : "warning"}>{String(e.level).toUpperCase()}</Badge>
                    </TD>
                    <TD className="text-text-2">{e.scope}</TD>
                    <TD className="text-text-1/90">{e.message}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
