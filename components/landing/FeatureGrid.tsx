"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileSearch, BadgeCheck, AlertTriangle, Timer, Layers, Shield } from "lucide-react";

const items = [
  { icon: FileSearch, title: "Tender Intelligence Report", desc: "Clear summary from 200+ pages: scope, eligibility, docs, penalties." },
  { icon: BadgeCheck, title: "Pre-Qualification Score", desc: "Instant readiness score based on org profile and clauses." },
  { icon: AlertTriangle, title: "Penalty Hotspots", desc: "Highlights SLA traps, liquidated damages, termination clauses." },
  { icon: Timer, title: "Deadline Control", desc: "Checklist, time-to-submit plan, and missing document alerts." },
  { icon: Layers, title: "Compliance Center", desc: "Structured list of mandatory forms, annexures, certificates." },
  { icon: Shield, title: "Audit Trail", desc: "Decision-grade rationale: why to bid, what to fix, what to avoid." }
];

export function FeatureGrid() {
  return (
    <section id="features" className="container-max py-16">
      <div className="grid-12 items-end">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-xs text-white/60 uppercase tracking-widest">Capability Suite</div>
          <h2 className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight">Built for MSMEs that cannot afford rejection.</h2>
          <p className="mt-3 text-white/65 max-w-2xl">
            BidSutra AI is a desktop-first operating layer for tender teams: extract, evaluate, and execute with precision.
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={idx}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <Card className="h-full hover:shadow-elev1 transition">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/6 grid place-items-center">
                    <Icon size={18} className="text-[hsl(var(--accent))]" />
                  </div>
                  <CardTitle className="mt-4">{it.title}</CardTitle>
                  <CardDescription className="mt-2">{it.desc}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
