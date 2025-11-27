import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import CreateInternshipDialog from "@/components/CreateInternshipDialog";
import {
  useInternships,
  useActiveJobCount,
  useTotalApplications,
  useSuspendInternship,
} from "@/hooks/useInternships";
import {
  Users,
  FileText,
  UserCheck,
  Briefcase,
  ChevronLeft,
  Search,
  Eye,
  Ban,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Internships() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);

  const { data: internshipsData, isLoading: internshipsLoading } =
    useInternships(currentPage, searchQuery);
  const { data: activeJobData } = useActiveJobCount();
  const { data: totalApplicationsData } = useTotalApplications();
  const { mutate: suspendInternship, isPending: isSuspending } =
    useSuspendInternship();

  const internships = internshipsData?.data || [];
  const totalPages = internshipsData?.totalPages || 1;
  const activeJobs = activeJobData?.activeJobs || 0;
  const totalApplications = totalApplicationsData?.totalApplications || 0;

  const handleSuspend = (internshipId: string) => {
    setSuspendingId(internshipId);
    suspendInternship(internshipId, {
      onSettled: () => {
        setSuspendingId(null);
      },
    });
  };

  const handleViewDetails = (internshipId: string) => {
    navigate(`/internships/${internshipId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Total Active Jobs
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {activeJobs.toString().padStart(2, "0")}
                </p>
                <p className="text-xs text-teal-600">+5% from last month</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {totalApplications}
                </p>
                <p className="text-xs text-teal-600">+2 today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  JD Analytics
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">20</p>
                <p className="text-xs text-orange-500">
                  20 people viewed Today
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Candidate's Reports
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {totalApplications}
                </p>
                <p className="text-xs text-teal-600">
                  Goal: Select 15 Candidates
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Listing */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Active Job Post
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by Job Title"
                  className="pl-10 rounded-full border-gray-300"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <CreateInternshipDialog />
            </div>
          </div>

          {internshipsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Active Jobs Found</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "No jobs match your search criteria"
                  : "Create your first job posting to start receiving applications"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship) => (
                  <Card
                    key={internship.id}
                    className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {internship.title}
                        </h3>

                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1">
                          Active
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Created by:</span>
                          <span className="font-medium text-gray-800">
                            {internship.company_name}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Applications:</span>
                          <span className="font-medium text-gray-800">
                            {internship.application_count || 0}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-gray-800">
                            {internship.duration}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Created on:</span>
                          <span className="font-medium text-gray-800">
                            {new Date(internship.created_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 rounded-full border-red-300 text-red-600 hover:bg-red-50"
                              disabled={
                                isSuspending && suspendingId === internship.id
                              }
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              {isSuspending && suspendingId === internship.id
                                ? "Suspending..."
                                : "Suspend"}
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Suspend Internship
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to suspend "
                                {internship.title}"? This will change the status
                                to closed and it will no longer accept new
                                applications.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleSuspend(internship.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Suspend
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="outline"
                          className="flex-1 rounded-full border-gray-300 hover:bg-gray-50"
                          onClick={() => handleViewDetails(internship.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
