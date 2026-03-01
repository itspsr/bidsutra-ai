"use client";

import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/components/ui/risk-gauge";
import { motion } from "framer-motion";
import { ShieldCheck, Landmark, Files, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-70" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[980px] rounded-full bg-[rgba(91,141,239,0.12)] blur-3xl" />
      <div className="container-max pt-16 pb-20">
        <div className="grid-12 items-center">
          <div className="col-span-12 lg:col-span-7">
            <motion.h1
              className="text-4xl lg:text-5xl font-semibold tracking-tight text-white/95 leading-[1.05]"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              Tender Intelligence for serious bidders.
              <span className="block text-[hsl(var(--accent))] mt-2">Risk-first. Compliance-ready. Decision-grade.</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-base text-white/70 leading-relaxed max-w-2xl"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              BidSutra AI turns long government tenders into a structured view: eligibility checks, penalty hotspots,
              required documents, and a clear “bid / don’t bid” signal—built for MSMEs, contractors, and infrastructure firms.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <Button size="lg" leftIcon={<Sparkles size={18} />} onClick={() => location.assign("/tender-upload")}> 
                Upload Tender (Demo)
              </Button>
              <Button size="lg" variant="secondary" leftIcon={<Landmark size={18} />} onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
                See how it works
              </Button>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {[ 
                { icon: <Files size={18} />, title: "Clause Extraction", desc: "Eligibility, EMD, penalties, annexures, forms." },
                { icon: <ShieldCheck size={18} />, title: "Compliance Signals", desc: "Missing docs, rejection risks, readiness score." }
              ].map((x, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                    {x.icon} {x.title}
                  </div>
                  <div className="text-sm text-white/60 mt-1">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 mt-10 lg:mt-0 flex justify-center">
            <motion.div
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-6 shadow-elev2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <div className="text-xs text-white/60 uppercase tracking-widest">Live Risk Gauge</div>
              <div className="mt-4">
                <RiskGauge value={79} label="Bid Readiness" />
              </div>
              <div className="mt-5 text-sm text-white/70 leading-relaxed max-w-[320px]">
                Institutional scoring helps prioritize tenders that match your profile and avoid hidden penalties.
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-14 hr-soft" />
      </div>
    </section>
  );
}
