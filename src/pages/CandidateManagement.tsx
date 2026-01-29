import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import {
  Search,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useAppliedCandidates,
  useShortlistedCandidates,
  useHiredCandidates,
  useInterviewSchedule,
} from "@/hooks/useApplications";
import HiredCandidateCard from "@/components/HiredCandidateCard";
import InterviewScheduledCard from "@/components/InterviewScheduledCard";
import StatCard from "@/components/StatCard";

export default function CandidateManagement() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "hired" | "interviewed" | "shortlisted"
  >("all");
  const pageSize = 6;

  const appliedQuery = useAppliedCandidates({
    page: activeTab === "all" ? page : 1,
    limit: pageSize,
    search: activeTab === "all" ? searchQuery : "",
  });
  const shortlistedQuery = useShortlistedCandidates({
    page: activeTab === "shortlisted" ? page : 1,
    limit: pageSize,
    search: activeTab === "shortlisted" ? searchQuery : "",
  });
  const hiredQuery = useHiredCandidates({
    page: activeTab === "hired" ? page : 1,
    limit: pageSize,
    search: activeTab === "hired" ? searchQuery : "",
  });
  const interviewQuery = useInterviewSchedule({
    page: activeTab === "interviewed" ? page : 1,
    limit: pageSize,
    search: activeTab === "interviewed" ? searchQuery : "",
  });

  const getActiveQuery = () => {
    switch (activeTab) {
      case "all":
        return appliedQuery;
      case "shortlisted":
        return shortlistedQuery;
      case "hired":
        return hiredQuery;
      case "interviewed":
        return interviewQuery;
      default:
        return appliedQuery;
    }
  };

  const currentQuery = getActiveQuery();
  const rawItems = currentQuery.data?.data ?? [];
  const pagination = currentQuery.data?.pagination;

  const items = searchQuery
    ? rawItems.filter((item: any) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rawItems;

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "hired") return "bg-green-100 text-green-700";
    if (s === "shortlisted") return "bg-yellow-100 text-yellow-700";
    if (s === "applied") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full mx-auto px-4 sm:px-12 lg:px-40 py-6 lg:py-10">
        <button
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Registered Candidates"
            count={appliedQuery.data?.pagination?.totalItems}
            active={activeTab === "all"}
            onClick={() => {
              setActiveTab("all");
              setPage(1);
            }}
            icon={<Users className="w-6 h-6 text-orange-600" />}
            bgColor="bg-orange-50"
            borderColor="border-orange-500"
            subText="+0 from last month"
          />
          <StatCard
            title="Hired by Units"
            count={hiredQuery.data?.pagination?.totalItems}
            active={activeTab === "hired"}
            onClick={() => {
              setActiveTab("hired");
              setPage(1);
            }}
            icon={<Briefcase className="w-6 h-6 text-cyan-600" />}
            bgColor="bg-cyan-50"
            borderColor="border-cyan-500"
            subText="Total Hired"
          />
          <StatCard
            title="Interview Scheduled"
            count={interviewQuery.data?.pagination?.totalItems}
            active={activeTab === "interviewed"}
            onClick={() => {
              setActiveTab("interviewed");
              setPage(1);
            }}
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            bgColor="bg-blue-50"
            borderColor="border-blue-500"
            subText="Scheduled"
          />
          <StatCard
            title="Shortlisted candidates"
            count={shortlistedQuery.data?.pagination?.totalItems}
            active={activeTab === "shortlisted"}
            onClick={() => {
              setActiveTab("shortlisted");
              setPage(1);
            }}
            icon={<UserCheck className="w-6 h-6 text-teal-600" />}
            bgColor="bg-teal-50"
            borderColor="border-teal-500"
            subText="Goal: Selection"
          />
        </div>

        <div className="px-2 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "all"
                ? "Candidates Management"
                : activeTab === "hired"
                  ? "Hired Candidates"
                  : activeTab === "interviewed"
                    ? "Scheduled Interviews"
                    : "Shortlisted Candidates"}
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by names"
                className="pl-10 rounded-full border-gray-300"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {currentQuery.isLoading ? (
            <div className="text-center py-20 text-gray-400 font-medium">
              Loading data...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <Users className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-400">
                No Candidates Found
              </h3>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${activeTab === "hired" || activeTab === "interviewed" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
              >
                {items.map((item: any) => {
                  // Handle specialized cards for Interview and Hired tabs
                  if (activeTab === "interviewed")
                    return (
                      <InterviewScheduledCard
                        key={item.applicationId}
                        id={item.applicationId}
                        student_name={item.name}
                        student_avatar_url={item.avatarUrl}
                        internship_title={item.internshipName || "Internship"}
                        scheduled_date={item.interviewDate}
                        unit_name={item.unitName || "Unit"}
                        unit_avatar_url={item.unitAvatarUrl}
                        job_type={item.internshipJobType}
                        duration={item.internshipDuration}
                        onViewProfile={() =>
                          navigate(`/candidate/${item.applicationId}`)
                        }
                      />
                    );

                  if (activeTab === "hired")
                    return (
                      <HiredCandidateCard
                        key={item.applicationId}
                        id={item.applicationId}
                        name={item.name}
                        avatar_url={item.avatarUrl}
                        internship_title={item.internshipName}
                        duration={item.internshipDuration}
                        job_type={item.internshipJobType}
                        unit_name={item.unitName}
                        unit_avatar_url={item.unitAvatarUrl}
                      />
                    );

                  // Standard Candidate UI Card for "All" and "Shortlisted" tabs
                  const skills = Array.isArray(item.skills) ? item.skills : [];
                  const interests = Array.isArray(item.interests)
                    ? item.interests
                    : [];
                  const profileSummary =
                    item.profileSummary || "No profile summary available.";

                  return (
                    <Card
                      key={item.applicationId}
                      className="min-w-[350px] border border-border/50 hover:shadow-lg transition-shadow rounded-3xl flex flex-col"
                    >
                      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                        {/* Header Section */}
                        <div className="flex items-center gap-3 sm:gap-5">
                          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-green-500">
                            <AvatarImage
                              src={item.avatarUrl ?? undefined}
                              alt={item.name ?? "Candidate"}
                              className="object-cover"
                            />
                            <AvatarFallback className="font-semibold bg-gray-200 text-gray-700">
                              {item.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "C"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-900 truncate">
                              {item.name || "Unknown"}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700 mb-2 truncate">
                              {item.internshipName || "No internship"}
                            </p>
                            <Badge
                              className={`${getStatusColor(
                                item.applicationStatus || item.status,
                              )} text-xs sm:text-sm px-2 sm:px-3 py-1 capitalize`}
                            >
                              {item.applicationStatus || item.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Profile Summary */}
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                          {profileSummary}
                        </p>

                        {/* Skills and Interests */}
                        <div className="min-h-7">
                          {skills.length > 0 ? (
                            <div className="flex gap-2 overflow-hidden">
                              {skills
                                .slice(0, 3)
                                .map((skill: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              {skills.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                                >
                                  +{skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          ) : interests.length > 0 ? (
                            <div className="flex gap-2 overflow-hidden">
                              {interests
                                .slice(0, 3)
                                .map((interest: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                                  >
                                    {interest}
                                  </Badge>
                                ))}
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-400 italic">
                              No skills listed
                            </div>
                          )}
                        </div>

                        <div className="border-t border-border/40 mt-auto"></div>

                        {/* Action Button */}
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 text-sm py-3 rounded-full cursor-pointer mt-4"
                          onClick={() =>
                            navigate(`/candidate/${item.applicationId}`)
                          }
                        >
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <Pagination
                currentPage={page}
                totalPages={pagination?.totalPages || 1}
                onPageChange={setPage}
                className="mt-10"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}