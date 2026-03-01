"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Starter",
    price: "₹0",
    note: "For evaluation",
    badge: "Free",
    features: ["1 report / week", "Basic clause extraction", "Limited checklist"],
    cta: "Start Free"
  },
  {
    name: "Professional",
    price: "₹2,999/mo",
    note: "For active bidders",
    badge: "Most Chosen",
    features: ["20 reports / month", "Risk scoring + penalty hotspots", "Compliance Center", "Email alerts"],
    cta: "Go Professional"
  },
  {
    name: "Enterprise",
    price: "₹24,999/mo",
    note: "For tender teams",
    badge: "Institutional",
    features: ["Unlimited reports", "Org profiles", "Governance templates", "Priority support"],
    cta: "Talk to Sales"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="container-max py-16">
      <div className="grid-12 items-end">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-xs text-white/60 uppercase tracking-widest">Pricing</div>
          <h2 className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight">Designed for Indian MSME economics.</h2>
          <p className="mt-3 text-white/65 max-w-2xl">Clear limits. Predictable usage. No hidden add-ons.</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <Card key={t.name} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.name}</CardTitle>
                <Badge tone={t.badge === "Most Chosen" ? "gold" : "neutral"}>{t.badge}</Badge>
              </div>
              <div className="mt-3 text-3xl font-semibold">{t.price}</div>
              <CardDescription className="mt-1">{t.note}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-white/70 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[hsl(var(--accent))]">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button className="w-full" variant={t.badge === "Most Chosen" ? "primary" : "secondary"}>
                  {t.cta}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
