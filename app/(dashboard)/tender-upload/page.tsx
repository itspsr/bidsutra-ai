"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function TenderUploadPage() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [stateName, setStateName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [valueCr, setValueCr] = useState<string>("");
  const [rawText, setRawText] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(18);

    try {
      const res = await fetch("/api/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          department: department || undefined,
          state: stateName || undefined,
          deadline: deadline || undefined,
          est_value_cr: valueCr ? Number(valueCr) : undefined,
          raw_text: rawText || undefined
        })
      });

      setProgress(66);
      const json = await res.json();
      if (!json.success) {
        setError(json.reason || "Failed");
        setLoading(false);
        setProgress(0);
        return;
      }

      setProgress(100);
      setResult(json);
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "Network error");
      setLoading(false);
      setProgress(0);
    }
  }

  return (
    <Shell title="Tender Upload" subtitle="Create a tender record, compute risk score, and generate a starter compliance checklist.">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>New Tender</CardTitle>
            <CardDescription>Store metadata now; attach PDF parsing later.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm text-text-2">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="SOC Managed Services (36 Months)" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">Department</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="MeitY / NIC" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">State</label>
                <Input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="Delhi" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">Deadline</label>
                <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-text-2">Estimated Value (₹ Cr)</label>
                <Input value={valueCr} onChange={(e) => setValueCr(e.target.value)} placeholder="18.5" inputMode="decimal" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm text-text-2">Tender Text (optional)</label>
                <Textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste extracted clauses or key tender text" />
              </div>
            </div>

            {error ? <div className="mt-4 text-sm text-critical">{error}</div> : null}

            <div className="mt-5 flex items-center gap-3">
              <Button variant="primary" disabled={loading || title.trim().length < 4} onClick={submit}>
                {loading ? "Creating…" : "Create Tender"}
              </Button>
              <div className="flex-1">
                <Progress value={progress} />
              </div>
            </div>

            {result ? (
              <div className="mt-6 rounded-lg border border-line bg-surface-2/40 p-4">
                <div className="text-sm font-semibold text-text-1">Tender created</div>
                <div className="mt-1 text-sm text-text-2">Tender ID: <span className="num text-text-1/90">{result.tender_id}</span></div>
                <div className="mt-2 text-sm text-text-2">
                  Risk: <span className="text-text-1 font-medium">{result.risk.level}</span> ({result.risk.score}/100)
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Next</CardTitle>
            <CardDescription>Workflow</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-text-2 space-y-2">
            <div>• Review Risk Breakdown drivers</div>
            <div>• Execute Compliance checklist</div>
            <div>• Configure GeM Alerts</div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
