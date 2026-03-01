"use client";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/LogoMark";
import { motion } from "framer-motion";

export function StickyNav() {
  return (
    <motion.div
      className="sticky top-0 z-40 border-b border-white/8 backdrop-blur bg-black/30"
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="container-max h-16 flex items-center justify-between">
        <LogoMark />
        <div className="hidden md:flex items-center gap-3 text-sm text-white/70">
          <a href="#features" className="hover:text-white/95">Features</a>
          <a href="#how" className="hover:text-white/95">How it works</a>
          <a href="#pricing" className="hover:text-white/95">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            View pricing
          </Button>
          <Button size="sm" onClick={() => location.assign("/overview")}>Open Dashboard</Button>
        </div>
      </div>
    </motion.div>
  );
}
