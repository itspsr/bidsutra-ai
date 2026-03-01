export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TenderRow = {
  id: string;
  title: string;
  dept: string;
  state: string;
  deadline: string;
  valueCr: number;
  match: number;
  risk: RiskLevel;
};

export const kpi = {
  activeTenders: 46,
  dueIn48h: 9,
  avgMatch: 81,
  complianceReadiness: 86
};

export const tenders: TenderRow[] = [
  {
    id: "GOV-IT-DEL-2026-0412",
    title: "Secure Network Operations Center (NOC) + SOC Managed Services (36 Months)",
    dept: "MeitY / NIC",
    state: "Delhi",
    deadline: "2026-03-12",
    valueCr: 22.4,
    match: 84,
    risk: "MEDIUM"
  },
  {
    id: "PSU-FIN-MH-2026-0089",
    title: "FinTech Reconciliation + Treasury Integration for PSU",
    dept: "Finance Department",
    state: "Maharashtra",
    deadline: "2026-03-04",
    valueCr: 11.2,
    match: 72,
    risk: "HIGH"
  },
  {
    id: "STATE-IT-KA-2026-1108",
    title: "IT Helpdesk + Field Support for State Departments",
    dept: "State e-Governance",
    state: "Karnataka",
    deadline: "2026-03-06",
    valueCr: 6.7,
    match: 78,
    risk: "LOW"
  }
];

export const riskBreakdown = [
  { name: "Eligibility", value: 26 },
  { name: "EMD / Fees", value: 14 },
  { name: "SLA Penalties", value: 24 },
  { name: "Technical", value: 20 },
  { name: "Documentation", value: 16 }
];

export const weeklyPipeline = [
  { day: "Mon", opportunities: 7 },
  { day: "Tue", opportunities: 9 },
  { day: "Wed", opportunities: 6 },
  { day: "Thu", opportunities: 10 },
  { day: "Fri", opportunities: 8 }
];
