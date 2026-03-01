"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { useEffect, useMemo, useState } from "react";

export default function ComplianceCenterPage() {
  const { state, actions } = useDemo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const t = state.tenders[0];
  const pct = useMemo(() => {
    if (!t) return 0;
    return Math.round((t.compliance.completed / Math.max(1, t.compliance.total)) * 100);
  }, [t]);

  return (
    <Shell title="Compliance Center" subtitle="Checklist execution with realistic state, empty/error patterns, and micro-interactions (simulated).">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t?.title ?? "—"}</CardTitle>
                <CardDescription>Readiness score + required documents</CardDescription>
              </div>
              <Badge tone={pct >= 85 ? "success" : pct >= 65 ? "gold" : "warning"}>{pct}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : t ? (
              <div className="space-y-2">
                {t.compliance.items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => actions.toggleCompliance(t.id, it.id)}
                    className="w-full rounded-md border border-line bg-surface-2/40 px-4 py-3 flex items-center justify-between hover:bg-white/5"
                  >
                    <div className="text-sm text-text-1">{it.label}</div>
                    <div className="flex items-center gap-2">
                      {it.required ? <Badge tone="neutral">Required</Badge> : <Badge tone="neutral">Optional</Badge>}
                      <Badge tone={it.completed ? "success" : "warning"}>{it.completed ? "DONE" : "PENDING"}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Smart suggestions</CardTitle>
            <CardDescription>AI-native compliance hints</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <>
                <div className="rounded-md border border-line bg-surface-2/40 p-4 text-sm text-text-2">
                  Suggested: Upload completion certificates first to reduce eligibility rejection risk.
                  <div className="mt-3"><Separator /></div>
                  <div className="mt-3">Next: Generate bidder undertaking and annexure matrix.</div>
                </div>
                <div className="mt-4">
                  <Button variant="primary" className="w-full" onClick={() => actions.markActivity("Compliance pack exported (simulated)", "teal")}>Export compliance pack</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
