export type RiskInputs = {
  eligibility: number;
  financial: number;
  penalty: number;
  experience: number;
  deadline: number;
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreRiskTotal(input: RiskInputs) {
  const total =
    input.eligibility * 0.25 +
    input.financial * 0.2 +
    input.penalty * 0.2 +
    input.experience * 0.2 +
    input.deadline * 0.15;

  return clamp(total);
}
