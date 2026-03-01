import { cn } from "@/utils/cn";

export function Badge(props: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "gold" | "steel" }) {
  const { className, tone = "neutral", ...rest } = props;

  const tones = {
    neutral: "bg-white/6 text-white/80 border-white/10",
    steel: "bg-slate-500/10 text-slate-200 border-slate-400/20",
    gold: "bg-[rgba(196,154,51,0.16)] text-[rgb(212,177,90)] border-[rgba(196,154,51,0.28)]"
  };

  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
    />
  );
}
