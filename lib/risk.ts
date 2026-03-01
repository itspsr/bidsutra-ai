export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export function scoreTenderRisk(input: {
  deadline?: string | null;
  hasRawText: boolean;
  estValueCr?: number | null;
  orgCompleteness: number; // 0-100
}) {
  let score = 55;

  // deadline pressure
  if (input.deadline) {
    const now = new Date();
    const d = new Date(input.deadline + "T00:00:00");
    const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 2) score += 18;
    else if (days <= 7) score += 10;
    else score += 4;
  } else {
    score += 6;
  }

  // missing text -> uncertainty
  if (!input.hasRawText) score += 14;

  // deal size tends to increase compliance scrutiny
  const v = input.estValueCr ?? 0;
  if (v >= 50) score += 14;
  else if (v >= 10) score += 8;
  else if (v >= 5) score += 4;

  // org completeness reduces risk
  score -= Math.round((input.orgCompleteness / 100) * 18);

  score = Math.max(0, Math.min(100, score));

  const level: RiskLevel =
    score >= 85 ? "CRITICAL" : score >= 70 ? "HIGH" : score >= 55 ? "MEDIUM" : "LOW";

  const drivers = {
    deadline: input.deadline ? true : false,
    hasRawText: input.hasRawText,
    estValueCr: v,
    orgCompleteness: input.orgCompleteness
  };

  return { score, level, drivers };
}
