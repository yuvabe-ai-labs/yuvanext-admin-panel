import { Card } from "@/components/ui/card";
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
import { Ellipsis, Eye, Ban, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnits } from "@/hooks/useRecentUsers";
import { useDeactivateAccount, useActivateAccount } from "@/hooks/useSuspend";
import { toast } from "sonner";

export default function CompanyManagement() {
  const navigate = useNavigate();
  // Using page 1 and limit 10 as per your previous setup
  const { data: units, isLoading } = useUnits(1, 10);
  const deactivateMutation = useDeactivateAccount();
  const activateMutation = useActivateAccount();

  const handleSuspendAccount = async (unitId: string, unitName: string) => {
    try {
      await deactivateMutation.mutateAsync(unitId);
      toast.success(`${unitName}'s account has been suspended`);
    } catch (error) {
      console.error("Error suspending account:", error);
      toast.error("Failed to suspend account. Please try again.");
    }
  };

  const handleActivateAccount = async (unitId: string, unitName: string) => {
    try {
      await activateMutation.mutateAsync(unitId);
      toast.success(`${unitName}'s account has been reactivated`);
    } catch (error) {
      console.error("Error activating account:", error);
      toast.error("Failed to reactivate account. Please try again.");
    }
  };

  return (
    <Card className="border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Company Management
        </h3>

        <button
          className="font-medium no-underline text-blue-600 text-sm hover:text-blue-800 cursor-pointer"
          onClick={() => navigate("/company-management")}
        >
          View all
        </button>
      </div>

      <div className="h-[300px] overflow-y-auto space-y-0 scrollbar-hide pr-2">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Loading companies...
          </p>
        ) : !units || units.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No companies found
          </p>
        ) : (
          units.map((unit, index) => {
            const key = unit.userId || `unit-${index}`;

            /** * UPDATED LOGIC:
             * accountStatus: true  => Inactive (Suspended)
             * accountStatus: false => Active
             */
            const isInactive = unit.accountStatus === true;

            return (
              <div
                key={key}
                className="flex justify-between items-center py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors rounded-xl px-2"
              >
                {/* LEFT SECTION */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-gray-100">
                    <AvatarImage
                      src={unit.avatarUrl ?? undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">
                      {(unit.name ?? "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center">
                      <p className="font-semibold text-gray-900">
                        {unit.name || "Unknown Unit"}
                      </p>

                      <Badge
                        className={`ml-2 border-0 font-medium px-2 py-0.5 text-[10px] rounded-md shadow-none ${
                          !isInactive
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {!isInactive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 font-medium">
                      {unit.email || "No email"}
                    </p>

                    <div className="text-[10px] text-gray-400 flex items-center gap-3 mt-1 tracking-tight">
                      <span>{unit.totalApplications || 0} Applications</span>
                      <span>
                        {unit.totalActiveInternships || 0} Active Posts
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION: SETTINGS MENU */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 rounded-full hover:bg-gray-100"
                    >
                      <Ellipsis className="w-5 h-5 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-xl shadow-lg border-gray-100"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer py-2"
                      onClick={() => navigate(`/units/${unit.userId}`)}
                    >
                      <Eye className="w-4 h-4 mr-2 text-gray-500" />
                      View Details
                    </DropdownMenuItem>

                    {/* Show Suspend only if account is NOT inactive (Active) */}
                    {!isInactive ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer py-2"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">
                              Suspend this account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will suspend <strong>{unit.name}</strong>'s
                              account immediately. They will lose access to the
                              platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="rounded-full">
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() =>
                                handleSuspendAccount(
                                  unit.userId,
                                  unit.name || "Unknown Unit",
                                )
                              }
                              disabled={deactivateMutation.isPending}
                              className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6"
                            >
                              {deactivateMutation.isPending
                                ? "Suspending..."
                                : "Suspend Account"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-green-600 focus:bg-green-50 focus:text-green-600 cursor-pointer py-2"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Retrieve
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">
                              Reactivate this account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will restore <strong>{unit.name}</strong>'s
                              access to the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="rounded-full">
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() =>
                                handleActivateAccount(
                                  unit.userId,
                                  unit.name || "Unknown Unit",
                                )
                              }
                              disabled={activateMutation.isPending}
                              className="bg-green-600 text-white hover:bg-green-700 rounded-full px-6"
                            >
                              {activateMutation.isPending
                                ? "Reactivating..."
                                : "Reactivate Account"}
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
    </Card>
  );
}
