"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, THead, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { useEffect, useState } from "react";

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(ms / 60_000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

export default function AdminLogsPage() {
  const { state } = useDemo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Shell title="Admin • Logs" subtitle="Simulated audit trail + error telemetry for investor demo polish.">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Activity stream</CardTitle>
            <CardDescription>Local demo events</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Time</TH>
                    <TH>Event</TH>
                  </TR>
                </THead>
                <tbody>
                  {state.activities.slice(0, 50).map((a) => (
                    <TR key={a.id}>
                      <TD className="text-text-2 num">{timeAgo(a.at)}</TD>
                      <TD>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-text-1/90">{a.text}</div>
                          <Badge tone={a.tone as any}>{a.tone.toUpperCase()}</Badge>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
