import Navbar from "@/components/Navbar";
import {
  BagIcon,
  DoubleProfileIcon,
  PasteIcon,
  ProfileIcon,
} from "@/components/ui/custom-icons";
import { useUnitStatsOverview } from "@/hooks/useUnitStats";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  ChevronLeft,
  SearchIcon,
  Ellipsis,
  Eye,
  Ban,
  Check,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddCompanyForm from "@/components/AddCompanyForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useUnits } from "@/hooks/useRecentUsers";
import { useDeactivateAccount, useActivateAccount } from "@/hooks/useSuspend";
import { toast } from "sonner";

export default function CompanyManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const navigate = useNavigate();
  const { data: units, isLoading } = useUnits(page, pageSize);
  const { data: unitStats } = useUnitStatsOverview();
  const deactivateMutation = useDeactivateAccount();
  const activateMutation = useActivateAccount();

  const handleSuspendAccount = async (unitId: string, unitName: string) => {
    try {
      await deactivateMutation.mutateAsync(unitId);
      toast.success(`${unitName}'s account has been suspended`);
    } catch (error) {
      toast.error("Failed to suspend account");
    }
  };

  const handleActivateAccount = async (unitId: string, unitName: string) => {
    try {
      await activateMutation.mutateAsync(unitId);
      toast.success(`${unitName}'s account has been reactivated`);
    } catch (error) {
      toast.error("Failed to reactivate account");
    }
  };

  const filteredUnits =
    units?.filter(
      (unit) =>
        unit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-10 lg:px-30 py-8">
        <button
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* TOP CARDS */}
        <div className="pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatHeaderCard
              title="Registered Company"
              count={unitStats?.totalRegisteredUnits}
              icon={<DoubleProfileIcon className="w-5 h-5 text-teal-800" />}
            />
            <StatHeaderCard
              title="Active Company"
              count={unitStats?.activeUnits}
              icon={<PasteIcon className="w-5 h-5 text-teal-800" />}
            />
            <StatHeaderCard
              title="Active Jobs Posts"
              count={unitStats?.activeJobPosts}
              icon={<ProfileIcon className="w-5 h-5 text-teal-800" />}
            />
            <StatHeaderCard
              title="Total Applications"
              count={unitStats?.totalApplications}
              icon={<BagIcon className="w-5 h-5 text-teal-800" />}
            />
          </div>
        </div>

        {/* Company List */}
        <Card className="border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-600 font-semibold">
                Company Management
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Companies"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-64 h-9 pl-9 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
                <button
                  className="bg-teal-600 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-teal-700 transition-colors"
                  onClick={() => setIsDialogOpen(true)}
                >
                  + Add Company
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center py-10 text-gray-400">
                  Loading companies...
                </p>
              ) : filteredUnits.length === 0 ? (
                <p className="text-center py-10 text-gray-400">
                  No companies found
                </p>
              ) : (
                filteredUnits.map((unit) => {
                  /** * UPDATED LOGIC:
                   * accountStatus: true  => Inactive (gray)
                   * accountStatus: false => Active (green)
                   */
                  const isInactive = unit.accountStatus;

                  return (
                    <div
                      key={unit.userId}
                      className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={unit.avatarUrl ?? undefined} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">
                            {(unit.name ?? "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">
                              {unit.name || "Unknown"}
                            </h4>
                            <Badge
                              className={`px-2 py-0.5 text-[10px] rounded-md ${!isInactive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
                            >
                              {!isInactive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{unit.email}</p>
                          <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">
                            <span>
                              {unit.totalApplications || 0} Applications
                            </span>
                            <span>
                              {unit.totalActiveInternships || 0} Internships
                            </span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Ellipsis className="w-5 h-5 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => navigate(`/units/${unit.userId}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {/* IF NOT Inactive (Active), show Suspend button.
                            IF Inactive, show Retrieve (Reactivate) button.
                          */}
                          {!isInactive ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Suspend Account?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will immediately revoke access for{" "}
                                    {unit.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleSuspendAccount(
                                        unit.userId,
                                        unit.name
                                      )
                                    }
                                    className="bg-red-600"
                                  >
                                    Suspend
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-green-600 focus:bg-green-50 focus:text-green-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Retrieve
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Reactivate Account?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Restore platform access for {unit.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleActivateAccount(
                                        unit.userId,
                                        unit.name
                                      )
                                    }
                                    className="bg-green-600"
                                  >
                                    Reactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-xs text-gray-500">
                Page {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!units || units.length < pageSize}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto max-w-3xl">
            <VisuallyHidden>
              <DialogTitle>Add Company</DialogTitle>
            </VisuallyHidden>
            <AddCompanyForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function StatHeaderCard({
  title,
  count,
  icon,
}: {
  title: string;
  count?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
      <div>
        <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">
          {title}
        </p>
        <p className="text-2xl font-medium text-gray-600">
          {(count ?? 0).toString().padStart(2, "0")}
        </p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}
