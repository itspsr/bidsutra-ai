"use client";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/LogoMark";
import { useSidebar } from "@/hooks/useSidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Menu, Bell, Search, LogOut } from "lucide-react";

export function Topbar() {
  const sidebar = useSidebar();

  async function signOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      location.assign("/");
    }
  }

  return (
    <div className="h-16 border-b border-white/8 bg-black/20 backdrop-blur flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<Menu size={16} />} onClick={sidebar.toggle}>
          Menu
        </Button>
        <div className="hidden md:block">
          <LogoMark />
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 w-[520px]">
        <Search size={16} className="text-white/50" />
        <input
          className="bg-transparent outline-none text-sm text-white/80 w-full placeholder:text-white/40"
          placeholder="Search tenders, departments, states…"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" leftIcon={<Bell size={16} />}>
          Alerts
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<LogOut size={16} />} onClick={signOut}>
          Sign out
        </Button>
        <Button size="sm" onClick={() => location.assign("/tender-upload")}>New Report</Button>
      </div>
    </div>
  );
}
