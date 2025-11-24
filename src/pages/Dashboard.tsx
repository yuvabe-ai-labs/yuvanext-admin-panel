import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentCandidates from "@/components/dashboard/RecentCandidates";
import RecentUnits from "@/components/dashboard/RecentUnits";
import CompanyManagement from "@/components/dashboard/CompanyManagement";
import CandidateManagement from "@/components/dashboard/CandidateManagement";

import {
  useAllStudents,
  useAllUnits,
  useProfileStats,
} from "@/hooks/useProfile";
import { useCandidates } from "@/hooks/useCandidates";
import {
  calculateMonthlySignups,
  getNewProfilesThisMonth,
} from "@/utils/dashboardUtils";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, admin } = useAuth();
  const today = new Date();
  const formattedDate = format(today, "EEEE, dd MMMM yyyy");

  // Fetch units + students
  const { data: studentsData, isLoading: studentsLoading } = useAllStudents(
    1,
    10
  );
  const { data: unitsData, isLoading: unitsLoading } = useAllUnits(1, 10);

  const { data: allStudentsData } = useAllStudents(1, 1000);
  const { data: allUnitsData } = useAllUnits(1, 1000);
  const { data: profileStats } = useProfileStats();

  // Fetch real candidates from Supabase
  const { data: candidateData } = useCandidates();

  const recentStudents = studentsData?.data || [];
  const recentUnits = unitsData?.data || [];
  const totalStudents =
    allStudentsData?.count || profileStats?.totalStudents || 0;
  const totalUnits = allUnitsData?.count || profileStats?.totalUnits || 0;

  const newStudentsThisMonth = useMemo(
    () => getNewProfilesThisMonth(allStudentsData?.data || []),
    [allStudentsData]
  );

  const newUnitsThisMonth = useMemo(
    () => getNewProfilesThisMonth(allUnitsData?.data || []),
    [allUnitsData]
  );

  const performanceData = useMemo(
    () =>
      calculateMonthlySignups(
        allStudentsData?.data || [],
        allUnitsData?.data || []
      ),
    [allStudentsData, allUnitsData]
  );

  /** ⬇️ Supabase Candidate Profiles */
  const candidateProfiles = candidateData?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="w-full mx-auto px-4 sm:px-12 lg:px-40 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          <h1 className="text-3xl font-bold">
            Welcome back, {admin?.name || user?.email?.split("@")[0] || "Admin"}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4">
            <Card className="border border-border rounded-3xl">
              <div className="p-6">
                <StatsGrid
                  totalUnits={totalUnits}
                  totalStudents={totalStudents}
                  newUnitsThisMonth={newUnitsThisMonth}
                  newStudentsThisMonth={newStudentsThisMonth}
                />
                <PerformanceChart data={performanceData} />
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentCandidates
                students={recentStudents}
                isLoading={studentsLoading}
              />
              <RecentUnits units={recentUnits} isLoading={unitsLoading} />
            </div>

            {/* Company Management */}
            <CompanyManagement units={recentUnits} isLoading={unitsLoading} />
          </div>
        </div>

        {/* Candidate Management - now using real candidates */}
        <CandidateManagement candidates={candidateProfiles} />
      </div>
    </div>
  );
}
