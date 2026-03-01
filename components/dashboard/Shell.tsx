import { Separator } from "@/components/ui/separator";

export function Shell(props: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="px-8 py-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[22px] font-semibold tracking-tight text-text-1">{props.title}</div>
          {props.subtitle ? <div className="mt-1 text-sm text-text-2 max-w-3xl">{props.subtitle}</div> : null}
        </div>
        {props.right ? <div className="flex items-center gap-2">{props.right}</div> : null}
      </div>
      <div className="mt-5"><Separator /></div>
      <div className="mt-6">{props.children}</div>
    </div>
  );
}
