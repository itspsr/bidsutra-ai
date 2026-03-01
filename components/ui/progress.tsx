"use client";

import { motion } from "framer-motion";

export function Progress(props: { value: number }) {
  const v = Math.max(0, Math.min(100, props.value));
  return (
    <div className="h-2 rounded-full bg-white/6 overflow-hidden border border-line">
      <motion.div
        className="h-full bg-teal"
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
