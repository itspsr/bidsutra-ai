export type DemoPlan = "free" | "pro" | "enterprise";
export type ClauseSeverity = "low" | "medium" | "high" | "critical";

export type DemoClause = {
  id: string;
  clause_type: string;
  severity: ClauseSeverity;
  content: string;
};

export type DemoTender = {
  id: string;
  title: string;
  authority: string;
  status: "draft" | "active" | "submitted" | "won" | "lost";
  created_at: string;
  deadline: string;
  value_cr: number;
  risk_total: number;
  risk: {
    eligibility: number;
    financial: number;
    penalty: number;
    experience: number;
    deadline: number;
  };
  match_score: number;
  bid_recommendation: "BID" | "DON'T BID" | "REVIEW";
  clauses: DemoClause[];
  compliance: {
    completed: number;
    total: number;
    items: { id: string; label: string; required: boolean; completed: boolean }[];
  };
  ai: {
    summary: string;
    drivers: { label: string; note: string }[];
    suggested_documents: string[];
  };
};

export type DemoGemListing = {
  id: string;
  title: string;
  category: string;
  value_cr: number;
  deadline: string;
  match_score: number;
};

export type DemoActivity = {
  id: string;
  at: string;
  tone: "neutral" | "success" | "warning" | "critical" | "teal" | "gold";
  text: string;
};

export type DemoState = {
  version: "1.0-enterprise";
  org: { name: string } | null;
  user: { name: string; role: "Owner" | "Admin" | "Analyst" | "Viewer" };
  plan: DemoPlan;
  tenders: DemoTender[];
  gem: DemoGemListing[];
  activities: DemoActivity[];
  metrics: {
    enterprisesTrusted: number;
    totalUsers: number;
    arrCr: number;
    riskAnalyses24h: number;
  };
};

function iso(d: Date) {
  return d.toISOString();
}

function minutesAgo(min: number) {
  return iso(new Date(Date.now() - min * 60_000));
}

function daysFromNow(days: number) {
  return iso(new Date(Date.now() + days * 24 * 60 * 60_000));
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function createInitialDemoState(): DemoState {
  const t1: DemoTender = {
    id: id("tender"),
    title: "SOC Managed Services (36 Months)",
    authority: "NIC • MeitY", 
    status: "active",
    created_at: minutesAgo(3),
    deadline: daysFromNow(3),
    value_cr: 18.5,
    risk: { eligibility: 62, financial: 55, penalty: 78, experience: 58, deadline: 71 },
    risk_total: 70,
    match_score: 81,
    bid_recommendation: "REVIEW",
    clauses: [
      { id: id("cl"), clause_type: "Eligibility", severity: "high", content: "Requires 3 similar projects in last 5 years with completion certificates." },
      { id: id("cl"), clause_type: "Penalty", severity: "critical", content: "LD up to 10% of contract value with weekly accrual; SLA breach triggers termination." },
      { id: id("cl"), clause_type: "Financial", severity: "medium", content: "EMD required via DD/BG with strict format and submission timeline." },
      { id: id("cl"), clause_type: "Submission", severity: "low", content: "Two-envelope system; technical + commercial uploaded separately." }
    ],
    compliance: {
      completed: 4,
      total: 7,
      items: [
        { id: id("ci"), label: "GST Certificate", required: true, completed: true },
        { id: id("ci"), label: "PAN Card", required: true, completed: true },
        { id: id("ci"), label: "Udyam/MSME", required: false, completed: false },
        { id: id("ci"), label: "Work Orders", required: true, completed: true },
        { id: id("ci"), label: "Completion Certificates", required: true, completed: false },
        { id: id("ci"), label: "CA Turnover Certificate", required: true, completed: false },
        { id: id("ci"), label: "Annexures + Undertaking", required: true, completed: true }
      ]
    },
    ai: {
      summary:
        "High penalty exposure and strict SLA regime. Eligibility is achievable if you can evidence similar SOC engagements with completion certificates. Financial risk is moderate; focus on EMD format compliance.",
      drivers: [
        { label: "Penalty regime", note: "LD is steep; negotiate internal delivery buffer and escalation playbook." },
        { label: "Eligibility evidence", note: "Missing completion certificates increases rejection risk." },
        { label: "Deadline feasibility", note: "3 days remaining; accelerate annexures and signer availability." }
      ],
      suggested_documents: [
        "ISO 27001 certificate (if available)",
        "SLA acknowledgement note",
        "Project completion certificates",
        "EMD instrument draft",
        "Team CVs + experience matrix"
      ]
    }
  };

  const t2: DemoTender = {
    id: id("tender"),
    title: "Endpoint Security Renewal (12 Months)",
    authority: "PSU Bank • Mumbai", 
    status: "draft",
    created_at: minutesAgo(44),
    deadline: daysFromNow(9),
    value_cr: 6.2,
    risk: { eligibility: 42, financial: 38, penalty: 45, experience: 40, deadline: 33 },
    risk_total: 40,
    match_score: 89,
    bid_recommendation: "BID",
    clauses: [
      { id: id("cl"), clause_type: "Eligibility", severity: "medium", content: "OEM authorization letter required; past supply references preferred." },
      { id: id("cl"), clause_type: "Penalty", severity: "medium", content: "Delivery delays incur 0.5% per week capped at 5%." }
    ],
    compliance: {
      completed: 5,
      total: 6,
      items: [
        { id: id("ci"), label: "OEM Authorization", required: true, completed: true },
        { id: id("ci"), label: "PAN Card", required: true, completed: true },
        { id: id("ci"), label: "GST Certificate", required: true, completed: true },
        { id: id("ci"), label: "Turnover Proof", required: true, completed: true },
        { id: id("ci"), label: "Bid Undertaking", required: true, completed: true },
        { id: id("ci"), label: "Bank Solvency", required: false, completed: false }
      ]
    },
    ai: {
      summary:
        "Strong category alignment and manageable penalty terms. Primary risk is OEM authorization and ensuring commercial quote compliance.",
      drivers: [
        { label: "OEM dependency", note: "Confirm authorization letter is current and entity name matches." },
        { label: "Commercial compliance", note: "Double-check GST breakup and quote validity window." }
      ],
      suggested_documents: ["OEM authorization letter", "Price schedule template", "Support SLA sheet"]
    }
  };

  const gem: DemoGemListing[] = [
    { id: id("gem"), title: "SOC Managed Services", category: "Cybersecurity", value_cr: 20.0, deadline: daysFromNow(4), match_score: 82 },
    { id: id("gem"), title: "Email Security Gateway", category: "Cybersecurity", value_cr: 4.8, deadline: daysFromNow(11), match_score: 77 },
    { id: id("gem"), title: "SIEM Platform Subscription", category: "Cybersecurity", value_cr: 12.5, deadline: daysFromNow(6), match_score: 74 }
  ];

  const activities: DemoActivity[] = [
    { id: id("act"), at: minutesAgo(3), tone: "teal", text: "Tender analyzed • Risk profile generated" },
    { id: id("act"), at: minutesAgo(9), tone: "success", text: "Compliance checklist completed • 4/7 items" },
    { id: id("act"), at: minutesAgo(21), tone: "gold", text: "GeM match alert • Cybersecurity category" },
    { id: id("act"), at: minutesAgo(55), tone: "neutral", text: "Workspace created • v1.0 Enterprise" }
  ];

  return {
    version: "1.0-enterprise",
    org: null,
    user: { name: "Aarav", role: "Owner" },
    plan: "free",
    tenders: [t1, t2],
    gem,
    activities,
    metrics: {
      enterprisesTrusted: 120,
      totalUsers: 1840,
      arrCr: 6.8,
      riskAnalyses24h: 312
    }
  };
}

export function simulateTenderFromTitle(title: string): Partial<DemoTender> {
  const riskBase = Math.min(92, Math.max(28, 40 + (title.length % 38)));
  const penalty = Math.min(98, Math.max(30, riskBase + 8));
  const eligibility = Math.min(92, Math.max(25, riskBase - 4));
  const financial = Math.min(92, Math.max(22, riskBase - 10));
  const experience = Math.min(92, Math.max(20, riskBase - 6));
  const deadline = Math.min(92, Math.max(20, riskBase + 2));
  const total = Math.round(eligibility * 0.25 + financial * 0.2 + penalty * 0.2 + experience * 0.2 + deadline * 0.15);
  const match = Math.min(95, Math.max(52, 100 - Math.abs(72 - total)));
  const rec = total >= 78 ? "DON'T BID" : total <= 48 ? "BID" : "REVIEW";

  return {
    risk: { eligibility, financial, penalty, experience, deadline },
    risk_total: total,
    match_score: match,
    bid_recommendation: rec,
    clauses: [
      { id: id("cl"), clause_type: "Penalty", severity: total >= 78 ? "critical" : "high", content: "Simulated LD/SLA risk hotspot flagged by policy engine." },
      { id: id("cl"), clause_type: "Eligibility", severity: total >= 70 ? "high" : "medium", content: "Simulated eligibility proof requirements: similar work + certificates." },
      { id: id("cl"), clause_type: "Financial", severity: "medium", content: "Simulated EMD / PBG requirements with strict formats." }
    ],
    ai: {
      summary: "Simulated AI explanation generated from clause patterns and deadline profile.",
      drivers: [
        { label: "Penalty exposure", note: "Tight SLA and LD terms require delivery buffer." },
        { label: "Evidence quality", note: "Missing proofs increase rejection probability." },
        { label: "Timeline", note: "Align signer availability and annexures early." }
      ],
      suggested_documents: ["Completion certificates", "SLA acknowledgement", "EMD instrument draft", "ISO certificates (if any)"]
    }
  };
}
