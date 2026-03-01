"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeMAlertsPage() {
  return (
    <Shell title="GeM Alerts" subtitle="Public listing alerts and tender notifications (frontend demo).">
      <Card>
        <CardHeader>
          <CardTitle>No alerts configured</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          Configure category/state filters to receive email + WhatsApp alerts (mocked in this frontend).
        </CardContent>
      </Card>
    </Shell>
  );
}
