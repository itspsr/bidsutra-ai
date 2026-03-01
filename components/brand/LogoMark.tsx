import { cn } from "@/utils/cn";

export function LogoMark(props: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", props.className)}>
      <div className="h-8 w-8 rounded-md border border-line bg-surface-2/60 grid place-items-center">
        <div className="h-3.5 w-3.5 rounded-sm bg-gold" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-wide text-text-1">BidSutra AI</div>
        <div className="text-[11px] text-text-2">National Tender Intelligence</div>
      </div>
    </div>
  );
}
