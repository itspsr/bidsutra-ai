"use client";

import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommandBar } from "@/components/dashboard/CommandBar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Bell, LogOut, PanelLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";

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
    <div className="h-14 border-b border-line bg-surface-3/40 backdrop-blur">
      <div className="container-max h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" leftIcon={<PanelLeft size={16} />} onClick={sidebar.toggle}>
            Menu
          </Button>
          <Separator vertical className="hidden md:block" />
          <div className="hidden md:block">
            <LogoMark />
          </div>
        </div>

        <CommandBar />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Bell size={16} />}>Alerts</Button>
          <Button variant="ghost" size="sm" leftIcon={<LogOut size={16} />} onClick={signOut}>Sign out</Button>
          <Button variant="primary" size="sm" onClick={() => location.assign("/tender-upload")}>New</Button>
        </div>
      </div>
    </div>
  );
}
