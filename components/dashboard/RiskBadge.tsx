import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/lib/data";

export function RiskBadge(props: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { label: string; tone: any }> = {
    LOW: { label: "LOW", tone: "success" },
    MEDIUM: { label: "MEDIUM", tone: "gold" },
    HIGH: { label: "HIGH", tone: "warning" },
    CRITICAL: { label: "CRITICAL", tone: "critical" }
  };

  return <Badge tone={map[props.risk].tone}>{map[props.risk].label}</Badge>;
}
