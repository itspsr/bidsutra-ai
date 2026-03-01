"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Shell title="Settings" subtitle="Alerts, team access, and preferences (frontend demo).">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70 space-y-2">
          <div>• Email alerts: Enabled</div>
          <div>• WhatsApp alerts: Coming soon</div>
          <div>• SLA risk threshold: Medium+</div>
        </CardContent>
      </Card>
    </Shell>
  );
}
