import { cn } from "@/utils/cn";

export function Skeleton(props: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-white/6", props.className)} />;
}
