import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Pagination";
import { useInternships } from "@/hooks/useInternships";
import { useDisableInternship, useEnableInternship } from "@/hooks/useSuspend";
import {
  Users,
  FileText,
  ChevronLeft,
  Search,
  Eye,
  Ban,
  CheckCircle2,
  Plus,
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
import { toast } from "sonner";
import { useUnitStatsOverview } from "@/hooks/useUnitStats";
import CreateInternshipDialog from "@/components/CreateInternshipDialog"; // Ensure path is correct

export default function Internships() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const { data: unitStats } = useUnitStatsOverview();

  const { mutateAsync: disableInternship, isPending: isDisabling } =
    useDisableInternship();
  const { mutateAsync: enableInternship, isPending: isEnabling } =
    useEnableInternship();

  const { data: internshipsData, isLoading: internshipsLoading } =
    useInternships({
      page: currentPage,
      limit: 12,
    });

  const internships = internshipsData?.internships || [];
  const pagination = internshipsData?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const filteredInternships = internships.filter(
    (internship) =>
      internship.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.createdByName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (
    internshipId: string,
    currentStatus: string
  ) => {
    setActionId(internshipId);
    try {
      if (currentStatus === "active") {
        await disableInternship(internshipId);
        toast.success("Internship suspended successfully");
      } else {
        await enableInternship(internshipId);
        toast.success("Internship activated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleViewDetails = (internshipId: string) => {
    navigate(`/internships/${internshipId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isMutating = isDisabling || isEnabling;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {unitStats?.activeJobPosts || 0}
                </p>
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
                  {unitStats?.totalApplications || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Internship Posts
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by Job Title"
                  className="pl-10 rounded-full border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Integration of CreateInternshipDialog */}
              <CreateInternshipDialog>
                <Button className="bg-teal-600 hover:bg-teal-700 rounded-full px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New JD
                </Button>
              </CreateInternshipDialog>
            </div>
          </div>

          {internshipsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Internships Found</h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map((internship) => {
                  const isActive = internship.status === "active";
                  return (
                    <Card
                      key={internship.internshipId}
                      className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg text-gray-800 truncate pr-2">
                            {internship.name}
                          </h3>
                          <Badge
                            className={`${isActive ? "bg-green-500" : "bg-red-500"} text-white text-xs px-3 py-1`}
                          >
                            {internship.status}
                          </Badge>
                        </div>
                        <div className="space-y-3 mb-5">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Created by:</span>
                            <span className="font-medium text-gray-800">
                              {internship.createdByName}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Applications:</span>
                            <span className="font-medium text-gray-800">
                              {internship.totalApplications || 0}
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
                              {new Date(
                                internship.createdAt
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className={`flex-1 rounded-full border ${isActive ? "border-red-300 text-red-600 hover:bg-red-50" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                                disabled={
                                  isMutating &&
                                  actionId === internship.internshipId
                                }
                              >
                                {isActive ? (
                                  <Ban className="w-4 h-4 mr-2" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                {isMutating &&
                                actionId === internship.internshipId
                                  ? "Processing..."
                                  : isActive
                                    ? "Suspend"
                                    : "Enable"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {isActive ? "Suspend" : "Enable"} Internship
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to{" "}
                                  {isActive ? "suspend" : "enable"} "
                                  {internship.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleToggleStatus(
                                      internship.internshipId,
                                      internship.status
                                    )
                                  }
                                  className={
                                    isActive
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-full border-gray-300 hover:bg-gray-50"
                            onClick={() =>
                              handleViewDetails(internship.internshipId)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" /> View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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
