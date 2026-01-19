import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentCandidates from "@/components/dashboard/RecentCandidates";
import RecentUnits from "@/components/dashboard/RecentUnits";
import CompanyManagement from "@/components/dashboard/CompanyManagement";
import CandidateManagement from "@/components/dashboard/CandidateManagement";
import { useSignupPerformanceData } from "@/hooks/useStats";
import { calculateMonthlySignups } from "@/utils/dashboardUtils";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const today = new Date();
  const formattedDate = format(today, "EEEE, dd MMMM yyyy");

  // Fetch signup performance data
  const { data: signupData, isLoading } = useSignupPerformanceData();

  const performanceData = useMemo(
    () => calculateMonthlySignups(signupData || []),
    [signupData]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="w-full mx-auto px-4 sm:px-12 lg:px-40 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">{formattedDate}</p>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || user?.email?.split("@")[0] || "Admin"}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4">
            <Card className="border border-border rounded-3xl">
              <div className="p-6">
                <StatsGrid />
                <PerformanceChart
                  data={performanceData}
                  isLoading={isLoading}
                />
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentCandidates />
              <RecentUnits />
            </div>

            {/* Company Management */}
            <CompanyManagement />
          </div>
        </div>

        {/* Candidate Management */}
        <CandidateManagement />
      </div>
    </div>
  );
}
