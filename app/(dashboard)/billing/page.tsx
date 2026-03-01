"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemo } from "@/lib/demo/store";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const plans = [
  { key: "free" as const, name: "Free", price: "₹0", note: "For evaluation", features: ["3 tenders / month", "Core risk scoring", "Compliance checklist"] },
  { key: "pro" as const, name: "Pro", price: "₹2,999/mo", note: "For active bidders", features: ["25 tenders / month", "GeM matching", "Team workflows"] },
  { key: "enterprise" as const, name: "Enterprise", price: "Custom", note: "For tender teams", features: ["Unlimited", "Governance + audit", "Priority support"] }
];

export default function BillingPage() {
  const { state, actions } = useDemo();
  const [modal, setModal] = useState<null | "pro" | "enterprise">(null);
  const [loading, setLoading] = useState(false);

  const active = useMemo(() => state.plan, [state.plan]);

  async function checkout(plan: "pro" | "enterprise") {
    setLoading(true);
    await actions.upgradePlan(plan);
    setLoading(false);
    setModal(null);
  }

  return (
    <Shell title="Billing" subtitle="Investor-grade billing simulation. No Stripe. Realistic checkout flow + success state.">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 grid grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.key} className={p.key === "pro" ? "border-gold/25" : undefined}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{p.name}</CardTitle>
                  {active === p.key ? <Badge tone="teal">Active</Badge> : p.key === "pro" ? <Badge tone="gold">Most chosen</Badge> : <Badge tone="neutral">Plan</Badge>}
                </div>
                <div className="mt-2 text-3xl font-semibold num">{p.price}</div>
                <CardDescription className="mt-1">{p.note}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-text-2 space-y-2">
                  {p.features.map((f) => (
                    <div key={f}>• {f}</div>
                  ))}
                </div>
                <div className="mt-6">
                  {p.key === "free" ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Included
                    </Button>
                  ) : (
                    <Button variant={p.key === "pro" ? "primary" : "secondary"} className="w-full" onClick={() => setModal(p.key)}>
                      Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Checkout signals</CardTitle>
            <CardDescription>Simulated billing activity</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-text-2 space-y-3">
            <div className="rounded-md border border-line bg-surface-2/40 p-3">Plan: <span className="text-text-1 font-medium uppercase num">{state.plan}</span></div>
            <div className="rounded-md border border-line bg-surface-2/40 p-3">Security: tokenized payments (simulated)</div>
            <div className="rounded-md border border-line bg-surface-2/40 p-3">Invoices: auto-generated (simulated)</div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {modal ? (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => (!loading ? setModal(null) : null)} />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.995 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-xl rounded-lg border border-line bg-surface-1/90 backdrop-blur shadow-soft"
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-text-2">Fake checkout</div>
                      <div className="mt-1 text-lg font-semibold tracking-tight text-text-1">Upgrade to {modal.toUpperCase()}</div>
                    </div>
                    <Badge tone="gold">Simulated</Badge>
                  </div>
                  <div className="mt-4"><Separator /></div>
                  <div className="mt-4 text-sm text-text-2">Processing payment authorization and provisioning features.</div>
                  <div className="mt-4">
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
                        <Button variant="primary" onClick={() => checkout(modal)}>Confirm upgrade</Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Shell>
  );
}
