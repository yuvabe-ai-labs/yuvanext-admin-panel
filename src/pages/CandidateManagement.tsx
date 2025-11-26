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
  useCandidates,
  useCandidateStats,
  useHiredCandidates,
} from "@/hooks/useCandidates";
import {
  useScheduledInterviews,
  useInterviewStats,
  // useCancelInterview,
} from "@/hooks/useInterviews";
import HiredCandidateCard from "@/components/HiredCandidateCard";
import InterviewScheduledCard from "@/components/InterviewScheduledCard";

export default function CandidateManagement() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "hired" | "interviewed" | "shortlisted"
  >("all");

  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates(
    page,
    searchQuery
  );

  const { data: hiredCandidatesData, isLoading: hiredCandidatesLoading } =
    useHiredCandidates(page, searchQuery);

  const { data: interviewsData, isLoading: interviewsLoading } =
    useScheduledInterviews(page, searchQuery);

  const { data: statsData } = useCandidateStats();
  const { data: interviewStatsData } = useInterviewStats();
  // const cancelInterviewMutation = useCancelInterview();

  const allCandidates = candidatesData?.data ?? [];
  const hiredCandidates = hiredCandidatesData?.data ?? [];
  const scheduledInterviews = interviewsData?.data ?? [];

  const totalPages =
    activeTab === "hired"
      ? hiredCandidatesData?.totalPages ?? 1
      : activeTab === "interviewed"
      ? interviewsData?.totalPages ?? 1
      : candidatesData?.totalPages ?? 1;

  const totalCandidates = statsData?.totalCount ?? 0;
  const hiredCount = statsData?.hiredCount ?? 0;
  const interviewScheduledCount = interviewStatsData?.totalScheduled ?? 0;
  const shortlistedCount = statsData?.shortlistedCount ?? 0;

  const regularCandidates =
    activeTab === "all"
      ? allCandidates
      : activeTab === "shortlisted"
      ? allCandidates.filter((c) => c.status === "shortlisted")
      : [];

  const isLoading =
    activeTab === "hired"
      ? hiredCandidatesLoading
      : activeTab === "interviewed"
      ? interviewsLoading
      : candidatesLoading;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-600";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-600";
      case "interviewed":
        return "bg-purple-100 text-purple-600";
      case "hired":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "all":
        return "Candidates Management";
      case "hired":
        return "Hired by Units";
      case "interviewed":
        return "Interview Scheduled";
      case "shortlisted":
        return "Shortlisted Candidates";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full mx-auto px-4 sm:px-12 lg:px-40 py-6 lg:py-10">
        <button
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white "
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        {/* Tab Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab("all")}
            className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
              activeTab === "all"
                ? "border-orange-500 ring-2 ring-orange-200"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Registered Candidates
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {totalCandidates.toString().padStart(2, "0")}
                </p>
                <p className="text-xs text-teal-600">+0 from last month</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("hired")}
            className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
              activeTab === "hired"
                ? "border-cyan-500 ring-2 ring-cyan-200"
                : "border-gray-200 hover:border-cyan-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Hired by Units
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {hiredCount.toString().padStart(2, "0")}
                </p>
                <p className="text-xs text-teal-600">
                  {hiredCount} Scheduled today
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("interviewed")}
            className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
              activeTab === "interviewed"
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Interview Scheduled
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {interviewScheduledCount.toString().padStart(2, "0")}
                </p>
                <p className="text-xs text-teal-600">+2 today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("shortlisted")}
            className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all ${
              activeTab === "shortlisted"
                ? "border-cyan-500 ring-2 ring-cyan-200"
                : "border-gray-200 hover:border-cyan-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Shortlisted candidates
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {shortlistedCount.toString().padStart(2, "0")}
                </p>
                <p className="text-xs text-teal-600">
                  Goal: Select 3 Candidates
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tab Heading and Search */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {getTabTitle()}
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

          {/* Loading */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : activeTab === "interviewed" &&
            scheduledInterviews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">
                No Scheduled Interviews
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "No interviews match your search criteria"
                  : "No interviews have been scheduled yet"}
              </p>
            </div>
          ) : activeTab === "hired" && hiredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">
                No Hired Candidates Found
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "No hired candidates match your search criteria"
                  : "No candidates have been hired yet"}
              </p>
            </div>
          ) : (activeTab === "all" || activeTab === "shortlisted") &&
            regularCandidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Candidates Found</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "No candidates match your search criteria"
                  : "No candidates available in this category"}
              </p>
            </div>
          ) : (
            <>
              {/* Content based on active tab */}
              {activeTab === "interviewed" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scheduledInterviews.map((interview) => (
                    <InterviewScheduledCard
                      key={interview.id}
                      id={interview.application_id}
                      student_name={interview.student_name}
                      student_avatar_url={interview.student_avatar_url}
                      internship_title={interview.internship_title}
                      scheduled_date={interview.scheduled_date}
                      duration_minutes={interview.duration_minutes}
                      meeting_link={interview.meeting_link}
                      unit_name={interview.unit_name}
                      unit_avatar_url={interview.unit_avatar_url}
                      description={interview.description}
                      job_type={interview.job_type}
                      duration={interview.duration}
                      onViewProfile={(id) => navigate(`/candidate/${id}`)}
                    />
                  ))}
                </div>
              ) : activeTab === "hired" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {hiredCandidates.map((candidate) => (
                    <HiredCandidateCard
                      key={candidate.id}
                      id={candidate.id}
                      name={candidate.name}
                      avatar_url={candidate.avatar_url}
                      internship_title={candidate.internship_title}
                      duration={candidate.duration}
                      job_type={candidate.job_type}
                      unit_name={candidate.unit_name}
                      unit_avatar_url={candidate.unit_avatar_url}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularCandidates.map((application) => {
                    const skills = Array.isArray(application.skills)
                      ? application.skills
                      : [];

                    return (
                      <Card
                        key={application.id}
                        className="border border-border/50 hover:shadow-lg transition-shadow rounded-3xl"
                      >
                        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                          {/* Header */}
                          <div className="flex items-center gap-3 sm:gap-5">
                            {/* Avatar */}
                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-green-500">
                              <AvatarImage
                                src={application.avatar_url ?? undefined}
                                alt={application.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="font-semibold bg-gray-200 text-gray-700">
                                {application.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-900 truncate">
                                {application.name}
                              </h3>

                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                                {application.internship_title}
                              </p>

                              <Badge
                                className={`${getStatusColor(
                                  application.status
                                )} text-xs sm:text-sm px-2 sm:px-3 py-1`}
                              >
                                {application.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-3">
                            {Array.isArray(application.bio)
                              ? application.bio.join(" ")
                              : application.bio ||
                                "Passionate about creating user-centered digital experiences."}
                          </p>

                          {/* Skills */}
                          <div className="min-h-[28px]">
                            {skills.length > 0 && (
                              <div className="flex gap-2 overflow-hidden">
                                {skills.length > 3 ? (
                                  <>
                                    {skills.slice(0, 3).map((skill, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                                    >
                                      +{skills.length - 3}
                                    </Badge>
                                  </>
                                ) : (
                                  skills.map((skill, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                                    >
                                      {skill}
                                    </Badge>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          <div className="border-t border-border/40"></div>

                          {/* Button */}
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 text-sm py-3 rounded-full"
                            onClick={() =>
                              navigate(`/candidate/${application.id}`)
                            }
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-10"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
