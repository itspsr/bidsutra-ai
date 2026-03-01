"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RiskGauge } from "@/components/ui/risk-gauge";
import { Table, THead, TR, TH, TD } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { motion } from "framer-motion";
import { pageIn } from "@/lib/motion";
import { Sparkles, ShieldCheck, Lock, Command } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(ms / 60_000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

export default function OverviewPage() {
  const { state } = useDemo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const kpi = useMemo(() => {
    const active = state.tenders.filter((t) => t.status === "active").length;
    const due48h = state.tenders.filter((t) => new Date(t.deadline).getTime() < Date.now() + 48 * 60 * 60_000).length;
    const avgMatch = Math.round(state.tenders.reduce((a, t) => a + t.match_score, 0) / Math.max(1, state.tenders.length));
    const compliance = Math.round(
      (state.tenders.reduce((a, t) => a + t.compliance.completed / Math.max(1, t.compliance.total), 0) / Math.max(1, state.tenders.length)) * 100
    );
    const latestRisk = state.tenders[0]?.risk_total ?? 0;
    return { active, due48h, avgMatch, compliance, latestRisk };
  }, [state.tenders]);

  const trend = useMemo(() => {
    const base = [
      { d: "Mon", v: 10 },
      { d: "Tue", v: 14 },
      { d: "Wed", v: 12 },
      { d: "Thu", v: 18 },
      { d: "Fri", v: 22 },
      { d: "Sat", v: 17 },
      { d: "Sun", v: 24 }
    ];
    // subtle plan effect
    const mult = state.plan === "free" ? 1 : state.plan === "pro" ? 1.15 : 1.3;
    return base.map((x) => ({ day: x.d, opportunities: Math.round(x.v * mult) }));
  }, [state.plan]);

  return (
    <motion.div {...pageIn}>
      <Shell
        title="Operating System"
        subtitle="Tender intelligence, risk posture, compliance execution, and GeM matching—presented as an institutional workflow."
        right={
          <Button variant="primary" leftIcon={<Sparkles size={16} />} onClick={() => location.assign("/tender-upload")}
          >
            New Tender
          </Button>
        }
      >
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Trusted</CardTitle>
              <CardDescription>Enterprise adoption</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-9 w-24" /> : <div className="text-3xl font-semibold num">{state.metrics.enterprisesTrusted}+</div>}
              <div className="mt-2 text-xs text-text-2 uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} className="text-teal" /> Security posture: hardened
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Active</CardTitle>
              <CardDescription>Tenders tracked</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-9 w-14" /> : <div className="text-3xl font-semibold num">{kpi.active}</div>}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Due soon</CardTitle>
              <CardDescription>48 hour window</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-9 w-14" /> : <div className="text-3xl font-semibold num">{kpi.due48h}</div>}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>ARR</CardTitle>
              <CardDescription>Simulated</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-9 w-24" /> : <div className="text-3xl font-semibold num">₹{state.metrics.arrCr.toFixed(1)} Cr</div>}
              <div className="mt-2 text-xs text-text-2 uppercase tracking-widest">v{state.version}</div>
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Risk posture</CardTitle>
                  <CardDescription>Latest tender score</CardDescription>
                </div>
                <Badge tone="gold">Institutional</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              {loading ? <Skeleton className="h-[240px] w-[240px] rounded-full" /> : <RiskGauge value={kpi.latestRisk} label="Risk" size={240} />}
            </CardContent>
          </Card>

          <Card className="col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pipeline</CardTitle>
                  <CardDescription>Intake velocity</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="teal">Data-first</Badge>
                  <Badge tone="neutral">⌘K enabled</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ height: 260 }}>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-[220px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <XAxis dataKey="day" stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                    <YAxis stroke="rgba(156,163,175,0.55)" axisLine={{ stroke: "rgba(148,163,184,0.12)" }} tickLine={false} />
                    <Tooltip contentStyle={{ background: "rgba(17,24,39,0.92)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="opportunities" stroke="#2DD4BF" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Insight Panel</CardTitle>
                  <CardDescription>Simulated, integrated (not a chatbot)</CardDescription>
                </div>
                <Badge tone="teal">AI-native</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="rounded-md border border-line bg-surface-2/40 p-4 text-sm text-text-2">
                  <div className="flex items-center justify-between">
                    <div className="text-text-1 font-medium">Top actions (next 24h)</div>
                    <div className="flex items-center gap-2 text-xs text-text-2"><Command size={14} /> command-driven</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>• Confirm completion certificates for eligibility proofs.</div>
                    <div>• Prepare SLA acknowledgement + LD mitigation plan.</div>
                    <div>• Validate EMD instrument format and submission route.</div>
                  </div>
                  <div className="mt-4"><Separator /></div>
                  <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-text-2">
                    <ShieldCheck size={14} className="text-success" /> Smart compliance suggestions active
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Realistic feed</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-text-2 space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                state.activities.slice(0, 6).map((a) => (
                  <div key={a.id} className="rounded-md border border-line bg-surface-2/40 p-3 flex items-center justify-between">
                    <div>{a.text}</div>
                    <Badge tone={a.tone as any}>{timeAgo(a.at)}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-text-1">Tender watchlist</div>
              <div className="text-xs text-text-2">Simulated • {state.tenders.length} items</div>
            </div>
            <div className="mt-3">
              <Table>
                <THead>
                  <TR>
                    <TH>Title</TH>
                    <TH>Authority</TH>
                    <TH>Risk</TH>
                    <TH>Match</TH>
                    <TH>Deadline</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <tbody>
                  {state.tenders.slice(0, 10).map((t) => (
                    <TR key={t.id}>
                      <TD className="text-text-1/90">{t.title}</TD>
                      <TD className="text-text-2">{t.authority}</TD>
                      <TD className="num">{t.risk_total}</TD>
                      <TD className="num">{t.match_score}/100</TD>
                      <TD className="text-text-2 num">{new Date(t.deadline).toLocaleDateString()}</TD>
                      <TD>
                        <Badge tone={t.status === "active" ? "teal" : "neutral"}>{t.status.toUpperCase()}</Badge>
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Shell>
    </motion.div>
  );
}
