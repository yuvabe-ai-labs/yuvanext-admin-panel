import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UIUnit {
  profile: {
    id: string;
    full_name: string;
    email: string | null;
  };
  unit_profile: {
    unit_name: string | null;
    unit_type: string | null;
    avatar_url: string | null;
    address: string | null;
  } | null;
}

interface CompanyManagementProps {
  units: UIUnit[];
  isLoading: boolean;
}

export default function CompanyManagement({
  units,
  isLoading,
}: CompanyManagementProps) {
  return (
    <Card className="border border-border rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Company Management</h3>
        <button className="text-primary text-sm">View all</button>
      </div>

      <div className="h-[300px] overflow-y-auto space-y-4 scrollbar-hide">
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
              className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 transition-colors"
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
                </div>
              </div>

              {/* Right section */}
              <div className="text-right">
                <p className="text-sm text-primary font-medium">
                  {unit.unit_profile?.unit_type || "Company"}
                </p>

                {unit.unit_profile?.address && (
                  <p className="text-xs text-muted-foreground">
                    {unit.unit_profile.address}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
