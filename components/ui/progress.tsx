"use client";

import { motion } from "framer-motion";

export function Progress(props: { value: number }) {
  const v = Math.max(0, Math.min(100, props.value));
  return (
    <div className="h-2 rounded-full bg-white/8 overflow-hidden border border-white/10">
      <motion.div
        className="h-full bg-[hsl(var(--accent))]"
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
    </div>
  );
}
