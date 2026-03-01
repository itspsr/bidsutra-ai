"use client";

import * as React from "react";
import { createInitialDemoState, type DemoPlan, type DemoState, simulateTenderFromTitle, type DemoTender } from "@/lib/demo/mock";

type DemoActions = {
  setOrgName: (name: string) => void;
  collapseSidebar: () => void;
  toggleSidebar: () => void;
  createTenderSimulated: (input: { title: string; authority?: string; value_cr?: number; deadline?: string }) => Promise<string>;
  toggleCompliance: (tenderId: string, itemId: string) => void;
  markActivity: (text: string, tone?: any) => void;
  upgradePlan: (plan: DemoPlan) => Promise<void>;
};

type DemoUi = {
  sidebarCollapsed: boolean;
};

type DemoContextValue = {
  state: DemoState;
  ui: DemoUi;
  actions: DemoActions;
};

const DemoContext = React.createContext<DemoContextValue | null>(null);

function lsKey() {
  return "bidsutra_demo_state_v3";
}

function load(): DemoState {
  try {
    const raw = localStorage.getItem(lsKey());
    if (!raw) return createInitialDemoState();
    return JSON.parse(raw) as DemoState;
  } catch {
    return createInitialDemoState();
  }
}

function save(s: DemoState) {
  try {
    localStorage.setItem(lsKey(), JSON.stringify(s));
  } catch {}
}

function iso(d: Date) {
  return d.toISOString();
}

export function DemoProvider(props: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoState>(() => createInitialDemoState());
  const [ui, setUi] = React.useState<DemoUi>({ sidebarCollapsed: false });

  React.useEffect(() => {
    setState(load());
  }, []);

  React.useEffect(() => {
    save(state);
  }, [state]);

  const actions: DemoActions = {
    setOrgName(name) {
      setState((s) => ({
        ...s,
        org: { name: name.trim() },
        activities: [{ id: crypto.randomUUID(), at: iso(new Date()), tone: "success", text: `Onboarding completed • ${name.trim()}` }, ...s.activities]
      }));
    },
    collapseSidebar() {
      setUi((u) => ({ ...u, sidebarCollapsed: true }));
    },
    toggleSidebar() {
      setUi((u) => ({ ...u, sidebarCollapsed: !u.sidebarCollapsed }));
    },
    async createTenderSimulated(input) {
      // realistic fake delay
      await new Promise((r) => setTimeout(r, 1500));

      const base: DemoTender = {
        id: crypto.randomUUID(),
        title: input.title,
        authority: input.authority ?? "Government Authority",
        status: "draft",
        created_at: iso(new Date()),
        deadline: input.deadline ?? iso(new Date(Date.now() + 6 * 24 * 60 * 60_000)),
        value_cr: input.value_cr ?? 8.4,
        risk: { eligibility: 55, financial: 55, penalty: 55, experience: 55, deadline: 55 },
        risk_total: 55,
        match_score: 75,
        bid_recommendation: "REVIEW",
        clauses: [],
        compliance: {
          completed: 0,
          total: 6,
          items: [
            { id: crypto.randomUUID(), label: "GST Certificate", required: true, completed: false },
            { id: crypto.randomUUID(), label: "PAN Card", required: true, completed: false },
            { id: crypto.randomUUID(), label: "Work Orders", required: true, completed: false },
            { id: crypto.randomUUID(), label: "Completion Certificates", required: true, completed: false },
            { id: crypto.randomUUID(), label: "Turnover Proof (CA)", required: true, completed: false },
            { id: crypto.randomUUID(), label: "Annexures + Undertaking", required: true, completed: false }
          ]
        },
        ai: {
          summary: "Simulated analysis in progress.",
          drivers: [],
          suggested_documents: []
        }
      };

      const sim = simulateTenderFromTitle(input.title);
      const merged: DemoTender = {
        ...base,
        ...sim,
        risk: (sim.risk as any) ?? base.risk,
        clauses: (sim.clauses as any) ?? base.clauses,
        ai: (sim.ai as any) ?? base.ai
      };

      setState((s) => ({
        ...s,
        tenders: [merged, ...s.tenders],
        activities: [{ id: crypto.randomUUID(), at: iso(new Date()), tone: "teal", text: "Tender analyzed • Intelligence report generated" }, ...s.activities]
      }));

      return merged.id;
    },
    toggleCompliance(tenderId, itemId) {
      setState((s) => {
        const tenders = s.tenders.map((t) => {
          if (t.id !== tenderId) return t;
          const items = t.compliance.items.map((it) => (it.id === itemId ? { ...it, completed: !it.completed } : it));
          const completed = items.filter((i) => i.completed).length;
          return { ...t, compliance: { ...t.compliance, items, completed } };
        });
        return { ...s, tenders };
      });
    },
    markActivity(text, tone = "neutral") {
      setState((s) => ({
        ...s,
        activities: [{ id: crypto.randomUUID(), at: iso(new Date()), tone, text }, ...s.activities]
      }));
    },
    async upgradePlan(plan) {
      await new Promise((r) => setTimeout(r, 1500));
      setState((s) => ({
        ...s,
        plan,
        activities: [{ id: crypto.randomUUID(), at: iso(new Date()), tone: "success", text: `${plan.toUpperCase()} plan activated • Checkout completed` }, ...s.activities]
      }));
    }
  };

  return <DemoContext.Provider value={{ state, ui, actions }}>{props.children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
