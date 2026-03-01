"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Upload,
  ShieldAlert,
  ClipboardCheck,
  BellRing,
  CreditCard,
  Settings
} from "lucide-react";

const nav = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/tender-upload", label: "Tender Upload", icon: Upload },
  { href: "/risk-breakdown", label: "Risk Breakdown", icon: ShieldAlert },
  { href: "/compliance-center", label: "Compliance Center", icon: ClipboardCheck },
  { href: "/gem-alerts", label: "GeM Alerts", icon: BellRing },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <motion.aside
      className={cn(
        "h-[calc(100vh-56px)] border-r border-line bg-surface-3/30 backdrop-blur",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
      animate={{ width: collapsed ? 72 : 248 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-3">
        <div className="text-[11px] uppercase tracking-widest text-text-2 px-2 py-2">{collapsed ? "BS" : "Workspace"}</div>
        <nav className="mt-2 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 border border-transparent",
                  active ? "bg-white/5 border-line" : "hover:bg-white/4"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-md border border-line bg-surface-2/50 grid place-items-center",
                  active && "bg-gold/10 border-gold/25"
                )}>
                  <Icon size={16} className={cn("text-text-2", active && "text-gold")} />
                </div>
                {!collapsed ? <div className="text-sm text-text-1/90">{item.label}</div> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
