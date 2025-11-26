import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Unit } from "@/types/profile.types";
import { useNavigate } from "react-router-dom";

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
          className="font-medium no-underline text-blue-600 text-sm hover:text-blue-800 cursor-pointer"
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

                <div>
                  <p className="font-medium">
                    {unit.unit_profile?.unit_name || unit.profile.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {unit.profile.email}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {unit.application_count ?? 0} Applications &nbsp;|&nbsp;{" "}
                    {unit.active_internships_count ?? 0} Active Internships
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
