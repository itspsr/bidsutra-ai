export type MatchInputs = {
  categoryAlignment: number; // 0..100
  valueAlignment: number; // 0..100
  experienceRelevance: number; // 0..100
  deadlineFeasibility: number; // 0..100
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeMatchScore(i: MatchInputs) {
  // Simple deterministic blend (tunable)
  const total = i.categoryAlignment * 0.35 + i.valueAlignment * 0.2 + i.experienceRelevance * 0.3 + i.deadlineFeasibility * 0.15;
  return clamp(total);
}
