import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building2, Users } from "lucide-react";
import {
  useAllStudents,
  useAllUnits,
  useProfileStats,
} from "@/hooks/useProfile";

export default function Dashboard() {
  const { user, admin } = useAuth();
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Fetch recent students and units
  const { data: studentsData, isLoading: studentsLoading } = useAllStudents(
    1,
    5
  );
  const { data: unitsData, isLoading: unitsLoading } = useAllUnits(1, 5);
  const { data: profileStats } = useProfileStats();

  // Fetch all students and units to calculate this month's count
  const { data: allStudentsData } = useAllStudents(1, 1000);
  const { data: allUnitsData } = useAllUnits(1, 1000);

  const recentStudents = studentsData?.data || [];
  const recentUnits = unitsData?.data || [];

  // Use actual fetched data for total counts (more accurate)
  const totalStudents =
    allStudentsData?.count || profileStats?.totalStudents || 0;
  const totalUnits = allUnitsData?.count || profileStats?.totalUnits || 0;

  // Calculate new profiles this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newStudentsThisMonth = (allStudentsData?.data || []).filter(
    (student) => new Date(student.profile.created_at) >= startOfMonth
  ).length;

  const newUnitsThisMonth = (allUnitsData?.data || []).filter(
    (unit) => new Date(unit.profile.created_at) >= startOfMonth
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">{formattedDate}</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {admin?.name || user?.email?.split("@")[0] || "Admin"}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Performance Cards (4 columns) */}
          <div className="lg:col-span-4">
            <Card className="bg-white border-2 border-blue-300 shadow-sm">
              <CardContent className="p-6">
                {/* Grid of 4 stat cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Companies Card */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex flex-col items-start">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Companies</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {totalUnits}
                      </p>
                      <p className="text-xs text-blue-600">
                        +{newUnitsThisMonth} new this month
                      </p>
                    </div>
                  </div>

                  {/* Candidates Card */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex flex-col items-start">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Candidates</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {totalStudents}
                      </p>
                      <p className="text-xs text-orange-600">
                        +{newStudentsThisMonth} new this month
                      </p>
                    </div>
                  </div>

                  {/* Active Posts Card - Placeholder */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex flex-col items-start">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Active Posts</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        16
                      </p>
                      <p className="text-xs text-yellow-600">
                        +2 new this month
                      </p>
                    </div>
                  </div>

                  {/* Job Offers Card - Placeholder */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex flex-col items-start">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Job Offers</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        12
                      </p>
                      <p className="text-xs text-purple-600">
                        +3 new this month
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Profiles (8 columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recently Joined Candidates */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="px-5 py-4 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Recently Joined Candidates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {studentsLoading ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      Loading...
                    </p>
                  ) : recentStudents.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      No recent candidates
                    </p>
                  ) : (
                    recentStudents.map((student) => (
                      <div
                        key={student.profile.id}
                        className="flex items-start gap-3"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage
                            src={
                              student.student_profile?.avatar_url || undefined
                            }
                            alt={student.profile.full_name || "Student"}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-sm">
                            {student.profile.full_name
                              ?.charAt(0)
                              .toUpperCase() || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {student.profile.full_name || "Unknown"}
                          </h4>
                          {student.student_profile?.headline && (
                            <p className="text-xs text-gray-600 truncate">
                              {student.student_profile.headline}
                            </p>
                          )}
                          {student.student_profile?.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {student.student_profile.location}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recently Joined Units */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="px-5 py-4 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Recently Joined Units
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {unitsLoading ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      Loading...
                    </p>
                  ) : recentUnits.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      No recent units
                    </p>
                  ) : (
                    recentUnits.map((unit) => (
                      <div
                        key={unit.profile.id}
                        className="flex items-start gap-3"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage
                            src={unit.unit_profile?.avatar_url || undefined}
                            alt={unit.profile.full_name || "Unit"}
                          />
                          <AvatarFallback className="bg-purple-100 text-purple-700 font-medium text-sm">
                            {unit.unit_profile?.unit_name
                              ?.charAt(0)
                              .toUpperCase() ||
                              unit.profile.full_name?.charAt(0).toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {unit.unit_profile?.unit_name ||
                              unit.profile.full_name ||
                              "Unknown Unit"}
                          </h4>
                          {unit.unit_profile?.unit_type && (
                            <p className="text-xs text-gray-600 truncate">
                              {unit.unit_profile.unit_type}
                            </p>
                          )}
                          {unit.unit_profile?.address && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {unit.unit_profile.address}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Admin Console. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
