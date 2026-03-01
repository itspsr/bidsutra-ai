import { cn } from "@/utils/cn";

export function Shell(props: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn("px-8 py-8")}> 
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xl font-semibold tracking-tight text-white/95">{props.title}</div>
          {props.subtitle ? <div className="text-sm text-white/60 mt-1">{props.subtitle}</div> : null}
        </div>
        {props.right ? <div className="flex items-center gap-2">{props.right}</div> : null}
      </div>
      <div className="mt-6">{props.children}</div>
    </div>
  );
}
