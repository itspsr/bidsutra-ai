import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DemoProvider } from "@/lib/demo/store";
import { OnboardingGate } from "@/components/demo/OnboardingGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <OnboardingGate>
        <div className="min-h-screen">
          <Topbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </OnboardingGate>
    </DemoProvider>
  );
}
