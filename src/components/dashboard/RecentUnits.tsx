import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email?: string | null;
}

interface UnitProfile {
  unit_name?: string | null;
  unit_type?: string | null;
  address?: string | null;
  avatar_url?: string | null;
}

interface UnitRecord {
  profile: Profile;
  unit_profile: UnitProfile | null;
}

interface RecentUnitsProps {
  units: UnitRecord[];
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
            units.map((unit) => {
              const { profile, unit_profile } = unit;

              const unitName =
                unit_profile?.unit_name || profile.full_name || "Unnamed";

              const avatarUrl = unit_profile?.avatar_url ?? undefined;
              const unitType = unit_profile?.unit_type ?? null;
              const address = unit_profile?.address ?? null;

              return (
                <div key={profile.id} className="flex items-start gap-3 px-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                      {unitName.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 leading-tight">
                    <p className="font-medium text-sm">{unitName}</p>

                    {unitType && (
                      <p className="text-[12px] text-muted-foreground">
                        {unitType}
                      </p>
                    )}

                    {address && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {address}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
