import { cn } from "@/utils/cn";

export function Separator(props: { className?: string; vertical?: boolean }) {
  if (props.vertical) {
    return <div className={cn("w-px self-stretch bg-line", props.className)} />;
  }
  return <div className={cn("h-px w-full bg-line", props.className)} />;
}
