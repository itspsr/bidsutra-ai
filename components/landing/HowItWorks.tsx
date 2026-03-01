"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Upload tender PDF", d: "We parse sections, forms, clauses, and key dates." },
  { n: "02", t: "Eligibility + compliance extraction", d: "Mandatory criteria, exclusions, document list, and proofs." },
  { n: "03", t: "Risk scoring + action plan", d: "Red flags, penalty hotspots, and a submission checklist." }
];

export function HowItWorks() {
  return (
    <section id="how" className="container-max py-16">
      <div className="grid-12">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-xs text-white/60 uppercase tracking-widest">Workflow</div>
          <h2 className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight">From PDF chaos to an execution plan.</h2>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.32, delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="text-xs tracking-widest text-[hsl(var(--accent))]">{s.n}</div>
                <CardTitle className="mt-2">{s.t}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-white/65 leading-relaxed">{s.d}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
