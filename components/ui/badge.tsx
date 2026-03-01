import { cn } from "@/utils/cn";

export type BadgeTone = "neutral" | "gold" | "teal" | "success" | "warning" | "critical";

export function Badge(props: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  const { className, tone = "neutral", ...rest } = props;

  const tones: Record<BadgeTone, string> = {
    neutral: "bg-white/5 text-text-2 border-line",
    gold: "bg-gold/12 text-gold border-gold/25",
    teal: "bg-teal/12 text-teal border-teal/25",
    success: "bg-success/12 text-success border-success/25",
    warning: "bg-warning/12 text-warning border-warning/25",
    critical: "bg-critical/12 text-critical border-critical/25"
  };

  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide num",
        tones[tone],
        className
      )}
    />
  );
}
