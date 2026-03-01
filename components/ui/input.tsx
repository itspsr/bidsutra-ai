import { cn } from "@/utils/cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-line bg-surface-2/50 px-3 text-sm text-text-1",
        "outline-none placeholder:text-text-2/70 focus:border-line-strong focus:ring-2 focus:ring-teal/15",
        props.className
      )}
    />
  );
}
