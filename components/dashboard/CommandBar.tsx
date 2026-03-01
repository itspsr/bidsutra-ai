"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, LayoutDashboard, Upload, ShieldAlert, ClipboardCheck, BellRing, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Tender Upload", href: "/tender-upload", icon: Upload },
  { label: "Risk Breakdown", href: "/risk-breakdown", icon: ShieldAlert },
  { label: "Compliance Center", href: "/compliance-center", icon: ClipboardCheck },
  { label: "GeM Alerts", href: "/gem-alerts", icon: BellRing },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(s));
  }, [q]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 rounded-md border border-line bg-surface-2/50 px-3 h-10 w-[540px] text-sm text-text-2 hover:text-text-1"
        aria-label="Open command bar"
      >
        <Search size={16} className="text-text-2" />
        <span className="flex-1 text-left">Search commands…</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-text-2">
          <Command size={14} />K
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="absolute inset-0 flex items-start justify-center p-6 pt-24">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.995 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl rounded-lg border border-line bg-surface-1/90 backdrop-blur shadow-soft"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
                  <Search size={16} className="text-text-2" />
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-text-1 placeholder:text-text-2/70"
                    placeholder="Type to search…"
                  />
                  <button className="text-xs text-text-2 hover:text-text-1" onClick={() => setOpen(false)}>
                    Esc
                  </button>
                </div>

                <div className="p-2">
                  {filtered.map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.href}
                        onClick={() => {
                          setOpen(false);
                          setQ("");
                          router.push(a.href);
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-md border border-line bg-surface-2/60 grid place-items-center">
                            <Icon size={16} className="text-text-2" />
                          </div>
                          <div className="text-sm text-text-1">{a.label}</div>
                        </div>
                        <ArrowRight size={16} className="text-text-2" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
