"use client";

import { motion } from "framer-motion";
import { pageIn, fadeUp } from "@/lib/motion";
import { RiskGauge } from "@/components/ui/risk-gauge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, FileSearch, AlertTriangle } from "lucide-react";

function Metric(props: { label: string; value: string; tone?: any }) {
  return (
    <div className="flex items-end justify-between">
      <div className="text-xs uppercase tracking-widest text-text-2">{props.label}</div>
      <div className="text-sm font-semibold num text-text-1">{props.value}</div>
    </div>
  );
}

export function EditorialLanding() {
  return (
    <motion.div {...pageIn} className="min-h-screen">
      <div className="container-max pt-16 pb-12">
        <div className="grid-12">
          <div className="col-span-7">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-2">
                <Badge tone="gold">National Tender Intelligence</Badge>
                <Badge tone="teal">FinTech-grade risk</Badge>
              </div>
              <h1 className="h-hero mt-5">
                Read tenders like a system.
                <span className="block text-text-2">Decide like an institution.</span>
              </h1>
              <p className="p-body mt-5 max-w-2xl">
                BidSutra AI converts complex tender clauses into structured risk, compliance gaps, and an execution plan—built for Indian MSMEs and mid-size enterprises.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Button variant="primary" size="lg" leftIcon={<Sparkles size={16} />} onClick={() => location.assign("/tender-upload")}>Open Workspace</Button>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })}>View system preview</Button>
              </div>
            </motion.div>

            <div className="mt-10">
              <Separator />
            </div>

            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-10 grid grid-cols-3 gap-6">
              <div className="rounded-lg border border-line bg-surface-1/55 p-5 shadow-inset">
                <div className="flex items-center gap-2 text-sm text-text-1"><FileSearch size={16} className="text-teal" /> Clause Extraction</div>
                <div className="mt-2 text-sm text-text-2">Eligibility, EMD, penalties, annexures, forms.</div>
              </div>
              <div className="rounded-lg border border-line bg-surface-1/55 p-5 shadow-inset">
                <div className="flex items-center gap-2 text-sm text-text-1"><ShieldCheck size={16} className="text-success" /> Compliance Readiness</div>
                <div className="mt-2 text-sm text-text-2">Checklist, missing docs, and proofs required.</div>
              </div>
              <div className="rounded-lg border border-line bg-surface-1/55 p-5 shadow-inset">
                <div className="flex items-center gap-2 text-sm text-text-1"><AlertTriangle size={16} className="text-warning" /> Penalty Hotspots</div>
                <div className="mt-2 text-sm text-text-2">SLA traps and liquidated damages surfaced early.</div>
              </div>
            </motion.div>
          </div>

          <div id="preview" className="col-span-5">
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="rounded-lg border border-line bg-surface-1/55 shadow-soft">
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-text-2">Live Preview</div>
                  <div className="mt-1 text-sm font-semibold text-text-1">Tender Intelligence Snapshot</div>
                </div>
                <Badge tone="neutral">Demo data</Badge>
              </div>
              <div className="px-5"><Separator /></div>
              <div className="p-5 grid grid-cols-12 gap-4">
                <div className="col-span-7">
                  <div className="text-xs uppercase tracking-widest text-text-2">Risk posture</div>
                  <div className="mt-3">
                    <RiskGauge value={72} label="Risk" size={220} />
                  </div>
                </div>
                <div className="col-span-5 space-y-3">
                  <Metric label="Compliance" value="86%" />
                  <Metric label="Deadline" value="3 days" />
                  <Metric label="Match" value="81/100" />
                  <Separator />
                  <div className="text-xs uppercase tracking-widest text-text-2">AI-native layer</div>
                  <div className="mt-2 text-sm text-text-2">
                    Suggested: attach ISO certificates, revise SLA acknowledgement, confirm EMD instrument.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12"><Separator /></div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }} className="mt-10 grid grid-cols-12 gap-6">
          <div className="col-span-4 rounded-lg border border-line bg-surface-1/55 p-5">
            <div className="text-xs uppercase tracking-widest text-text-2">Activity</div>
            <div className="mt-2 text-sm text-text-1">System stream</div>
            <div className="mt-3 text-sm text-text-2 space-y-2">
              <div>• Risk score generated (Tender #GOV-IT-DEL-2026)</div>
              <div>• Checklist created (6 items)</div>
              <div>• Alert rule added (State: MH, Category: FinTech)</div>
            </div>
          </div>
          <div className="col-span-8 rounded-lg border border-line bg-surface-1/55 p-5">
            <div className="text-xs uppercase tracking-widest text-text-2">What you get</div>
            <div className="mt-2 text-sm text-text-1">A command-driven tender workspace</div>
            <div className="mt-3 text-sm text-text-2">
              Use ⌘K to navigate modules, generate risk explanations, and keep compliance execution aligned to deadlines.
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" onClick={() => location.assign("/login")}>Sign in</Button>
              <Button variant="primary" onClick={() => location.assign("/signup")}>Create account</Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-12"><Separator /></div>
        <div className="mt-8 flex items-center justify-between text-sm text-text-2">
          <div>© {new Date().getFullYear()} BidSutra AI</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-text-1">Security</a>
            <a href="#" className="hover:text-text-1">Compliance</a>
            <a href="#" className="hover:text-text-1">Contact</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
