"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminSystemPage() {
  const { state } = useDemo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const growth = useMemo(() => {
    const base = [
      { m: "Aug", u: 880 },
      { m: "Sep", u: 1040 },
      { m: "Oct", u: 1210 },
      { m: "Nov", u: 1390 },
      { m: "Dec", u: 1560 },
      { m: "Jan", u: 1710 },
      { m: "Feb", u: state.metrics.totalUsers }
    ];
    return base;
  }, [state.metrics.totalUsers]);

  return (
    <Shell title="Admin • System" subtitle="Investor metrics simulation: users, ARR, growth, webhook health (fake).">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-3">
          <CardHeader><CardTitle>Total users</CardTitle><CardDescription>Simulated</CardDescription></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-9 w-24" /> : <div className="text-3xl font-semibold num">{state.metrics.totalUsers}</div>}</CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader><CardTitle>ARR</CardTitle><CardDescription>Simulated</CardDescription></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-9 w-28" /> : <div className="text-3xl font-semibold num">₹{state.metrics.arrCr.toFixed(1)} Cr</div>}</CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader><CardTitle>Analyses</CardTitle><CardDescription>Last 24h</CardDescription></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-9 w-20" /> : <div className="text-3xl font-semibold num">{state.metrics.riskAnalyses24h}</div>}</CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader><CardTitle>Webhook</CardTitle><CardDescription>Status</CardDescription></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-9 w-28" /> : <Badge tone="success">HEALTHY</Badge>}</CardContent>
        </Card>

        <Card className="col-span-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Growth</CardTitle>
                <CardDescription>Users over time</CardDescription>
              </div>
              <Badge tone="gold">Investor view</Badge>
            </div>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            {loading ? (
              <Skeleton className="h-[260px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growth}>
                  <XAxis dataKey="m" stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <YAxis stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,0.92)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="u" stroke="#C8A94C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
