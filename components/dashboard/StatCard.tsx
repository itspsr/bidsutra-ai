"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export function StatCard(props: { label: string; value: string | number; hint?: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xs text-white/60 uppercase tracking-widest">{props.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{props.value}</div>
          {props.hint ? <div className="text-sm text-white/55 mt-1">{props.hint}</div> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
