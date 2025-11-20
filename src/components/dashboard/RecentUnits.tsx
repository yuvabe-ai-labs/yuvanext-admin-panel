import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

// Use any type to accept whatever your API returns
interface RecentUnitsProps {
  units: any[];
  isLoading: boolean;
}

export default function RecentUnits({ units, isLoading }: RecentUnitsProps) {
  return (
    <Card className="border border-border rounded-2xl shadow-sm bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3">Recently Joined Units</h3>

        <div className="h-[250px] overflow-y-auto space-y-3 scrollbar-hide">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : units.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No recent units
            </p>
          ) : (
            units.map((unit) => (
              <div
                key={unit.profile.id}
                className="flex items-start gap-3 px-1"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={unit.unit_profile?.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {unit.unit_profile?.unit_name?.charAt(0) ||
                      unit.profile.full_name?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 leading-tight">
                  <p className="font-medium text-sm">
                    {unit.unit_profile?.unit_name || unit.profile.full_name}
                  </p>

                  {unit.unit_profile?.unit_type && (
                    <p className="text-[12px] text-muted-foreground">
                      {unit.unit_profile.unit_type}
                    </p>
                  )}

                  {unit.unit_profile?.address && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {unit.unit_profile.address}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
