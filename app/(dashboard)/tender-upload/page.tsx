"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { useState } from "react";

export default function TenderUploadPage() {
  const { state, actions } = useDemo();

  const [title, setTitle] = useState("");
  const [authority, setAuthority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [valueCr, setValueCr] = useState<string>("");
  const [rawText, setRawText] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdId, setCreatedId] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setCreatedId(null);
    setProgress(12);
    setTimeout(() => setProgress(38), 300);
    setTimeout(() => setProgress(64), 800);

    const id = await actions.createTenderSimulated({
      title,
      authority: authority || undefined,
      value_cr: valueCr ? Number(valueCr) : undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined
    });

    setProgress(100);
    setCreatedId(id);
    setLoading(false);
    actions.markActivity("Compliance checklist generated", "success");
  }

  const created = createdId ? state.tenders.find((t) => t.id === createdId) : null;

  return (
    <Shell
      title="Tender Intelligence"
      subtitle="Investor-grade upload simulation with realistic delays, auto-generated risk analysis, clause severity, and bid recommendation."
      right={<Badge tone="gold">Demo pipeline</Badge>}
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Upload simulation</CardTitle>
            <CardDescription>No backend. No external calls. All local state.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm text-text-2">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cybersecurity SOC Managed Services" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">Authority</label>
                <Input value={authority} onChange={(e) => setAuthority(e.target.value)} placeholder="NIC / PSU / State Dept" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">Deadline</label>
                <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">Estimated Value (₹ Cr)</label>
                <Input value={valueCr} onChange={(e) => setValueCr(e.target.value)} placeholder="12.5" inputMode="decimal" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm text-text-2">Tender text (optional)</label>
                <Textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste key clauses (optional)" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button variant="primary" disabled={loading || title.trim().length < 4} onClick={submit}>
                {loading ? "Analyzing…" : "Generate Intelligence"}
              </Button>
              <div className="flex-1">
                <Progress value={progress} />
              </div>
              <Badge tone="neutral">~1.5s</Badge>
            </div>

            {created ? (
              <div className="mt-6 rounded-lg border border-line bg-surface-2/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-text-1">Tender report generated</div>
                  <Badge tone={created.bid_recommendation === "BID" ? "success" : created.bid_recommendation === "DON'T BID" ? "critical" : "gold"}>
                    {created.bid_recommendation}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <div className="rounded-md border border-line bg-surface-1/50 p-3">
                    <div className="text-xs uppercase tracking-widest text-text-2">Risk</div>
                    <div className="mt-1 text-xl font-semibold num">{created.risk_total}/100</div>
                  </div>
                  <div className="rounded-md border border-line bg-surface-1/50 p-3">
                    <div className="text-xs uppercase tracking-widest text-text-2">Match</div>
                    <div className="mt-1 text-xl font-semibold num">{created.match_score}/100</div>
                  </div>
                  <div className="rounded-md border border-line bg-surface-1/50 p-3">
                    <div className="text-xs uppercase tracking-widest text-text-2">Clauses</div>
                    <div className="mt-1 text-xl font-semibold num">{created.clauses.length}</div>
                  </div>
                </div>
                <div className="mt-4"><Separator /></div>
                <div className="mt-4 text-sm text-text-2">{created.ai.summary}</div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={() => location.assign("/risk-breakdown")}>Open risk breakdown</Button>
                  <Button variant="secondary" onClick={() => location.assign("/compliance-center")}>Open compliance</Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Live report preview</CardTitle>
            <CardDescription>Clause severity + document suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : created ? (
              <>
                <div className="text-xs uppercase tracking-widest text-text-2">Clause severity</div>
                <div className="mt-3 space-y-2">
                  {created.clauses.map((c) => (
                    <div key={c.id} className="rounded-md border border-line bg-surface-2/40 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-text-1">{c.clause_type}</div>
                        <Badge tone={c.severity === "critical" ? "critical" : c.severity === "high" ? "warning" : c.severity === "medium" ? "gold" : "neutral"}>
                          {c.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-text-2">{c.content}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4"><Separator /></div>
                <div className="mt-4 text-xs uppercase tracking-widest text-text-2">Suggested documents</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {created.ai.suggested_documents.map((d) => (
                    <Badge key={d} tone="teal">{d}</Badge>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-text-2">Generate a tender to preview the intelligence report.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
