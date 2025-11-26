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
import type { Unit } from "@/types/profile.types";
import { useNavigate } from "react-router-dom";
import {
  useSuspendCandidate,
  useRetrieveCandidate,
} from "@/hooks/useCandidates";

interface CompanyManagementProps {
  units: Unit[];
  isLoading: boolean;
}

export default function CompanyManagement({
  units,
  isLoading,
}: CompanyManagementProps) {
  const navigate = useNavigate();
  const suspendMutation = useSuspendCandidate();
  const retrieveMutation = useRetrieveCandidate();

  const handleSuspendOne = async (profileId?: string) => {
    if (!profileId) return;
    try {
      await suspendMutation.mutateAsync({ profileId });
    } catch (error) {
      console.error("Error suspending candidate:", error);
    }
  };

  const handleRetrieveOne = async (profileId?: string) => {
    if (!profileId) return;
    try {
      await retrieveMutation.mutateAsync({ profileId });
    } catch (error) {
      console.error("Error retrieving candidate:", error);
    }
  };

  return (
    <Card className="border border-border rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Company Management</h3>

        <button
          className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer font-semibold"
          onClick={() => navigate("/company-management")}
        >
          View all
        </button>
      </div>

      <div className="h-[300px] overflow-y-auto space-y-0 scrollbar-hide">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Loading companies...
          </p>
        ) : units.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No companies found
          </p>
        ) : (
          units.map((unit, index) => {
            const profileId = unit.profile?.id;
            const key =
              unit.unit_profile?.id || unit.profile?.id || `unit-${index}`;

            return (
              <div
                key={key}
                className="flex justify-between items-center py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={unit.unit_profile?.avatar_url ?? undefined}
                    />
                    <AvatarFallback>
                      {(
                        unit.unit_profile?.unit_name ??
                        unit.profile?.full_name ??
                        "U"
                      ).charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      <p className="font-medium">
                        {unit.unit_profile?.unit_name || unit.profile.full_name}
                      </p>

                      <Badge
                        className={`ml-2 border-0 font-medium ${
                          unit.profile.is_suspended
                            ? "bg-gray-300 text-gray-700"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {unit.profile.is_suspended ? "Inactive" : "Active"}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {unit.profile.email}
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{unit.application_count ?? 0} Applications</span>
                      <span>
                        {unit.active_internships_count ?? 0} Active Internships
                      </span>
                      <span>
                        {typeof unit.profile.created_at === "string"
                          ? unit.profile.created_at.split("T")[0]
                          : "-"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* SETTINGS MENU */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/units/${unit.unit_profile?.id}`)
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>

                    {!unit.profile.is_suspended ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 bg-red-100 hover:bg-red-200"
                            onSelect={(e) => e.preventDefault()} // prevent auto-close
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Suspend this account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will suspend {unit.profile.full_name}'s
                              account immediately. They will lose access to the
                              platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => handleSuspendOne(profileId)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Suspend Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-green-600 bg-green-100 hover:bg-green-200"
                            onSelect={(e) => e.preventDefault()} // prevent auto-close
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Retrieve
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reactivate this account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will restore {unit.profile.full_name}'s
                              access to the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => handleRetrieveOne(profileId)}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              Reactivate Account
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
