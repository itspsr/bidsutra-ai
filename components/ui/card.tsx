import { cn } from "@/utils/cn";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        props.className
      )}
    />
  );
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-6 pb-3", props.className)} />;
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn("text-sm font-semibold tracking-wide text-white/90", props.className)} />;
}

export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn("text-sm text-[hsl(var(--muted-foreground))]", props.className)} />;
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-6 pt-3", props.className)} />;
}
