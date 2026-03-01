"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RiskGauge } from "@/components/ui/risk-gauge";
import { TenderTable } from "@/components/dashboard/TenderTable";
import { kpi, riskBreakdown, weeklyPipeline } from "@/lib/data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { Sparkles } from "lucide-react";

export default function OverviewPage() {
  return (
    <Shell
      title="Overview"
      subtitle="Data-first dashboard for tender pipeline, risk posture, and compliance execution."
      right={<Button variant="primary" leftIcon={<Sparkles size={16} />} onClick={() => location.assign("/tender-upload")}>New Tender</Button>}
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Active Tenders</CardTitle>
            <CardDescription>Tracked opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold num">{kpi.activeTenders}</div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Due in 48h</CardTitle>
            <CardDescription>Urgency watch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold num">{kpi.dueIn48h}</div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Avg Match</CardTitle>
            <CardDescription>Relevance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold num">{kpi.avgMatch}<span className="text-text-2 text-base">/100</span></div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
            <CardDescription>Readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold num">{kpi.complianceReadiness}<span className="text-text-2 text-base">%</span></div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Risk Gauge</CardTitle>
                <CardDescription>Latest posture</CardDescription>
              </div>
              <Badge tone="gold">Institutional</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RiskGauge value={72} label="Risk" size={240} />
          </CardContent>
        </Card>

        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>Opportunity Intake</CardTitle>
            <CardDescription>Weekly pipeline trend</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyPipeline}>
                <XAxis dataKey="day" stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                <YAxis stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,0.92)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="opportunities" stroke="#2DD4BF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>AI Insight</CardTitle>
            <CardDescription>Integrated recommendations (deterministic demo)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-line bg-surface-2/40 p-4 text-sm text-text-2">
              <div className="flex items-center justify-between">
                <div className="text-text-1 font-medium">Top actions for next 24 hours</div>
                <Badge tone="teal">Smart</Badge>
              </div>
              <div className="mt-3 space-y-2">
                <div>• Validate eligibility proofs (similar work + completion certificates).</div>
                <div>• Confirm EMD instrument format and submission route.</div>
                <div>• Prepare SLA acknowledgement and penalty clause acceptance note.</div>
              </div>
            </div>
            <div className="mt-4"><Separator /></div>
            <div className="mt-4 text-xs uppercase tracking-widest text-text-2">Risk drivers snapshot</div>
            <div className="mt-3" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskBreakdown}>
                  <XAxis dataKey="name" stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <YAxis stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,0.92)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12 }} />
                  <Bar dataKey="value" fill="#C8A94C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Activity Stream</CardTitle>
            <CardDescription>System events</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-text-2 space-y-3">
            <div className="rounded-md border border-line bg-surface-2/40 p-3">Risk score generated • Tender #GOV-IT-DEL-2026</div>
            <div className="rounded-md border border-line bg-surface-2/40 p-3">Checklist created • 6 mandatory docs</div>
            <div className="rounded-md border border-line bg-surface-2/40 p-3">Alert rule configured • State: MH</div>
          </CardContent>
        </Card>

        <div className="col-span-12">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-text-1">Tender Watchlist</div>
            <div className="text-xs text-text-2">Latest 50</div>
          </div>
          <div className="mt-3">
            <TenderTable />
          </div>
        </div>
      </div>
    </Shell>
  );
}
