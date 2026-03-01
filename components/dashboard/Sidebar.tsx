"use client";

import { cn } from "@/utils/cn";
import { useSidebar } from "@/hooks/useSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
        "h-[calc(100vh-64px)] border-r border-white/8 bg-black/25 backdrop-blur",
        collapsed ? "w-[84px]" : "w-[300px]"
      )}
      animate={{ width: collapsed ? 84 : 300 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
    >
      <div className="p-4">
        <div className="text-xs uppercase tracking-widest text-white/45 px-2 mb-3">
          {collapsed ? "BS" : "Workspace"}
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 border border-transparent transition",
                  active ? "bg-white/8 border-white/10" : "hover:bg-white/5"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl grid place-items-center border border-white/10 bg-white/5",
                    active && "bg-[rgba(196,154,51,0.14)] border-[rgba(196,154,51,0.24)]"
                  )}
                >
                  <Icon size={18} className={cn("text-white/75", active && "text-[hsl(var(--accent))]")} />
                </div>
                {!collapsed ? <div className="text-sm text-white/85">{item.label}</div> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
