"use client";

import { Shell } from "@/components/dashboard/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <Shell title="Billing" subtitle="Plans, invoices, and usage (frontend demo).">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          Professional — ₹2,999/month — Next renewal: 10 Mar 2026
        </CardContent>
      </Card>
    </Shell>
  );
}
