"use client";

import { Shell } from "@/components/dashboard/Shell";
import { StatCard } from "@/components/dashboard/StatCard";
import { TenderTable } from "@/components/dashboard/TenderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskGauge } from "@/components/ui/risk-gauge";
import { kpi, riskBreakdown, weeklyPipeline } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

const PIE = [
  "rgba(196,154,51,0.90)",
  "rgba(91,141,239,0.65)",
  "rgba(148,163,184,0.55)",
  "rgba(239,68,68,0.55)",
  "rgba(34,197,94,0.55)"
];

export default function OverviewPage() {
  return (
    <Shell
      title="Overview"
      subtitle="Institutional visibility into tender pipeline, risk posture, and compliance readiness."
      right={<Button onClick={() => location.assign("/tender-upload")}>Generate New Report</Button>}
    >
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Active Tenders" value={kpi.activeTenders} hint="Tracked across departments" />
        <StatCard label="Due in 48 Hours" value={kpi.dueIn48h} hint="High urgency items" />
        <StatCard label="Avg Match Score" value={`${kpi.avgMatch}%`} hint="Profile relevance" />
        <StatCard label="Compliance Readiness" value={`${kpi.complianceReadiness}%`} hint="Docs + eligibility" />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Bid Readiness Gauge</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RiskGauge value={79} label="Readiness" />
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskBreakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={96} paddingAngle={2}>
                  {riskBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(2,6,23,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Weekly Opportunity Intake</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPipeline}>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" />
                <YAxis stroke="rgba(255,255,255,0.35)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2,6,23,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12
                  }}
                />
                <Bar dataKey="opportunities" fill="rgba(91,141,239,0.75)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="col-span-7">
          <div className="text-sm font-semibold text-white/85 mb-3">Tender Watchlist</div>
          <TenderTable />
        </div>
      </div>
    </Shell>
  );
}
