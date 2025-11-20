import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import {
  useAllStudents,
  useAllUnits,
  useProfileStats,
} from "@/hooks/useProfile";
import { useMemo } from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentCandidates from "@/components/dashboard/RecentCandidates";
import RecentUnits from "@/components/dashboard/RecentUnits";
import CompanyManagement from "@/components/dashboard/CompanyManagement";
import CandidateManagement from "@/components/dashboard/CandidateManagement";
import {
  calculateMonthlySignups,
  getNewProfilesThisMonth,
} from "@/utils/dashboardUtils";

export default function Dashboard() {
  const { user, admin } = useAuth();
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Fetch data
  const { data: studentsData, isLoading: studentsLoading } = useAllStudents(
    1,
    10
  );
  const { data: unitsData, isLoading: unitsLoading } = useAllUnits(1, 10);
  const { data: allStudentsData } = useAllStudents(1, 1000);
  const { data: allUnitsData } = useAllUnits(1, 1000);
  const { data: profileStats } = useProfileStats();

  // Computed values
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

  const candidateProfiles = useMemo(
    () =>
      recentStudents.map((student) => ({
        id: student.profile.id,
        name: student.profile.full_name || "Unknown",
        role:
          student.student_profile?.profile_type || "Profile Type not specified",
        location: student.student_profile?.location || "",
        bio:
          student.student_profile?.bio ||
          "Passionate about creating user-centered digital experiences.",
        skills: student.student_profile?.skills || [],
        avatar_url: student.student_profile?.avatar_url,
      })),
    [recentStudents]
  );

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
            {/* Recent Cards */}
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

        {/* Candidate Management Section */}
        <CandidateManagement candidates={candidateProfiles} />
      </div>
    </div>
  );
}
