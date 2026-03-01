import { cn } from "@/utils/cn";

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-[hsl(var(--border))]">
      <table {...props} className={cn("w-full text-sm", props.className)} />
    </div>
  );
}

export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cn("bg-white/4 text-white/70", props.className)} />;
}

export function TR(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} className={cn("border-b border-white/8", props.className)} />;
}

export function TH(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider", props.className)}
    />
  );
}

export function TD(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn("px-4 py-3 text-white/85", props.className)} />;
}
