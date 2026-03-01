"use client";

import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommandBar } from "@/components/dashboard/CommandBar";
import { Bell, LogOut, PanelLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { useDemo } from "@/lib/demo/store";

export function Topbar() {
  const sidebar = useSidebar();
  const { state, actions } = useDemo();

  async function signOut() {
    try {
      localStorage.removeItem("bidsutra_demo_state_v3");
    } finally {
      location.assign("/overview");
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
          <div className="hidden lg:flex items-center gap-2 rounded-md border border-line bg-surface-2/50 px-3 h-10 text-sm text-text-2">
            <span className="text-text-2">{state.org?.name ?? "Workspace"}</span>
            <span className="text-text-2/50">•</span>
            <span className="text-text-1 num uppercase">{state.plan}</span>
          </div>
          <Button variant="ghost" size="sm" leftIcon={<Bell size={16} />} onClick={() => actions.markActivity("Alert simulated • New GeM match", "gold")}>Alerts</Button>
          <Button variant="ghost" size="sm" leftIcon={<LogOut size={16} />} onClick={signOut}>Reset demo</Button>
          <Button variant="primary" size="sm" onClick={() => location.assign("/tender-upload")}>New</Button>
        </div>
      </div>
    </div>
  );
}
