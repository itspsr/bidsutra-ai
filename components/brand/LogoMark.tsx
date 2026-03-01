import { cn } from "@/utils/cn";

export function LogoMark(props: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", props.className)}>
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 border border-white/10 shadow-elev1 grid place-items-center">
        <div className="h-4 w-4 rounded-sm bg-[hsl(var(--accent))] shadow-[0_0_0_6px_rgba(196,154,51,0.15)]" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-wide text-white/90">BidSutra AI</div>
        <div className="text-xs text-white/55">GovTech • FinTech Intelligence</div>
      </div>
    </div>
  );
}
