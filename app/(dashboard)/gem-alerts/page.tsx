"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function GemAlertsPage() {
  const { state } = useDemo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const chart = useMemo(() => state.gem.map((g) => ({ name: g.title.slice(0, 14) + "…", match: g.match_score })), [state.gem]);

  return (
    <Shell title="GeM Match Engine" subtitle="Simulated matching, alerting, and value comparison.">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>Top opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {state.gem.map((g) => (
                  <div key={g.id} className="rounded-md border border-line bg-surface-2/40 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-text-1">{g.title}</div>
                      <div className="text-sm text-text-2">{g.category} • ₹{g.value_cr.toFixed(1)} Cr • {new Date(g.deadline).toLocaleDateString()}</div>
                    </div>
                    <Badge tone={g.match_score >= 80 ? "success" : g.match_score >= 70 ? "gold" : "neutral"}>{g.match_score}%</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Match distribution</CardTitle>
            <CardDescription>Investor-grade charting</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            {loading ? (
              <Skeleton className="h-[260px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <XAxis dataKey="name" stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <YAxis stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,0.92)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12 }} />
                  <Bar dataKey="match" fill="#2DD4BF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alert simulation</CardTitle>
                <CardDescription>Context-based alerts</CardDescription>
              </div>
              <Badge tone="teal">Live-like</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-line bg-surface-2/40 p-4 text-sm text-text-2">
              Trigger: Cybersecurity • Value 5–25 Cr • Deadline &lt; 14 days
              <div className="mt-3"><Separator /></div>
              <div className="mt-3">Simulated: 3 matches detected. 1 high-fit match above 80%.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
