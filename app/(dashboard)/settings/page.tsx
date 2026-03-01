"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemo } from "@/lib/demo/store";
import { useState } from "react";

export default function SettingsPage() {
  const { state, actions } = useDemo();
  const [org, setOrg] = useState(state.org?.name ?? "");

  return (
    <Shell title="Settings" subtitle="Demo settings: organization + UI controls.">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Local demo state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm text-text-2">Organization name</label>
              <Input value={org} onChange={(e) => setOrg(e.target.value)} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={() => actions.setOrgName(org)}>Save</Button>
              <Button variant="secondary" onClick={() => actions.toggleSidebar()}>Toggle sidebar collapse</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Demo build</CardTitle>
            <CardDescription>Investor polish flags</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-text-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>Version</div>
              <Badge tone="gold">v{state.version}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>Plan</div>
              <Badge tone="teal">{state.plan.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>User</div>
              <Badge tone="neutral">{state.user.name} • {state.user.role}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
