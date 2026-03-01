"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function RiskBreakdownPage() {
  const { state } = useDemo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const t = state.tenders[0];

  const chart = useMemo(() => {
    if (!t) return [];
    return [
      { name: "Eligibility", value: t.risk.eligibility },
      { name: "Financial", value: t.risk.financial },
      { name: "Penalty", value: t.risk.penalty },
      { name: "Experience", value: t.risk.experience },
      { name: "Deadline", value: t.risk.deadline }
    ];
  }, [t]);

  return (
    <Shell title="Risk Breakdown" subtitle="Explainable risk drivers with institutional clarity (simulated).">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t?.title ?? "—"}</CardTitle>
                <CardDescription>{t?.authority ?? ""}</CardDescription>
              </div>
              {t ? (
                <Badge tone={t.risk_total >= 78 ? "critical" : t.risk_total >= 65 ? "warning" : t.risk_total >= 50 ? "gold" : "success"}>
                  {t.risk_total}/100
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent style={{ height: 280 }}>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <XAxis dataKey="name" stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <YAxis stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,0.92)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12 }} />
                  <Bar dataKey="value" fill="#C8A94C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Dynamic explanation</CardTitle>
            <CardDescription>Risk reasoning module</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : t ? (
              <>
                <div className="text-sm text-text-2">{t.ai.summary}</div>
                <div className="mt-4"><Separator /></div>
                <div className="mt-4 space-y-3">
                  {t.ai.drivers.map((d) => (
                    <div key={d.label} className="rounded-md border border-line bg-surface-2/40 p-3">
                      <div className="text-sm text-text-1">{d.label}</div>
                      <div className="mt-1 text-sm text-text-2">{d.note}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
