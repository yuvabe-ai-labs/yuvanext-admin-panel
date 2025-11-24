import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Unit } from "@/types/profile.types";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface CompanyManagementProps {
  units: Unit[];
  isLoading: boolean;
}

export default function CompanyManagement({
  units,
  isLoading,
}: CompanyManagementProps) {
  const navigate = useNavigate();

  return (
    <Card className="border border-border rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Company Management</h3>
        <button
          className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
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
          units.map((unit) => (
            <div
              key={unit.profile.id}
              className="flex justify-between items-center py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              {/* Left section */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={unit.unit_profile?.avatar_url ?? undefined}
                  />
                  <AvatarFallback>
                    {unit.unit_profile?.unit_name?.charAt(0) ??
                      unit.profile.full_name?.charAt(0) ??
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="w-full">
                  <div className="flex items-center">
                    <p className="font-medium">
                      {unit.unit_profile?.unit_name || unit.profile.full_name}
                    </p>

                    <Badge
                      className={`ml-2 border-0 font-medium ${
                        unit.profile.onboarding_completed
                          ? "bg-green-500 hover:bg-green-500 text-white"
                          : "bg-gray-300 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {unit.profile.onboarding_completed
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {unit.profile.email}
                  </p>

                  <p className="text-xs text-muted-foreground flex flex-wrap gap-4 pt-1">
                    <span>{unit.application_count ?? 0} Applications</span>
                    <span>
                      {unit.active_internships_count ?? 0} Active Internships
                    </span>
                    <span>{unit.profile.created_at.split("T")[0]}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
