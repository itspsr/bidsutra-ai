"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDemo } from "@/lib/demo/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function OnboardingGate(props: { children: React.ReactNode }) {
  const { state, actions } = useDemo();
  const [name, setName] = useState("");
  const [step, setStep] = useState<"org" | "welcome">("org");

  const open = useMemo(() => !state.org, [state.org]);

  return (
    <>
      {props.children}
      <AnimatePresence>
        {open ? (
          <motion.div key="ob" className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.995 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl rounded-lg border border-line bg-surface-1/90 backdrop-blur shadow-soft"
              >
                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-text-2">Onboarding</div>
                    <div className="mt-1 text-lg font-semibold tracking-tight text-text-1">BidSutra Workspace</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="gold">v1.0 Enterprise</Badge>
                    <Badge tone="teal">Demo</Badge>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  {step === "org" ? (
                    <>
                      <div className="text-sm text-text-2">Enter your organization name to provision a secure workspace.</div>
                      <div className="mt-4">
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Trident Systems Pvt. Ltd." />
                      </div>
                      <div className="mt-5 flex justify-end">
                        <Button
                          variant="primary"
                          disabled={name.trim().length < 2}
                          onClick={() => {
                            actions.setOrgName(name.trim());
                            setStep("welcome");
                            setTimeout(() => {}, 0);
                          }}
                        >
                          Create Workspace
                        </Button>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="text-sm text-text-2">Workspace ready.</div>
                      <div className="mt-2 text-2xl font-semibold tracking-tight text-text-1">Welcome to BidSutra AI.</div>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-md border border-line bg-surface-2/40 p-3">
                          <div className="text-xs uppercase tracking-widest text-text-2">Trusted by</div>
                          <div className="mt-1 text-lg font-semibold num">120+</div>
                        </div>
                        <div className="rounded-md border border-line bg-surface-2/40 p-3">
                          <div className="text-xs uppercase tracking-widest text-text-2">Security</div>
                          <div className="mt-1 text-sm text-text-1">SOC-ready</div>
                        </div>
                        <div className="rounded-md border border-line bg-surface-2/40 p-3">
                          <div className="text-xs uppercase tracking-widest text-text-2">Mode</div>
                          <div className="mt-1 text-sm text-text-1">Investor demo</div>
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end">
                        <Button variant="primary" onClick={() => location.assign("/overview")}>Enter OS</Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
