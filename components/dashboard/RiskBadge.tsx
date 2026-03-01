import { RiskLevel } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function RiskBadge(props: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { label: string; tone: "steel" | "gold" | "neutral" }> = {
    LOW: { label: "LOW", tone: "steel" },
    MEDIUM: { label: "MEDIUM", tone: "neutral" },
    HIGH: { label: "HIGH", tone: "gold" },
    CRITICAL: { label: "CRITICAL", tone: "gold" }
  };

  return <Badge tone={map[props.risk].tone}>{map[props.risk].label}</Badge>;
}
