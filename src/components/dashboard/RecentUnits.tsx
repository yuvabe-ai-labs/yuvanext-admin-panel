import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { useRecentUnits } from "@/hooks/useRecentUsers";

export default function RecentUnits() {
  const { data: units, isLoading } = useRecentUnits(1, 10);

  return (
    <Card className="border border-border rounded-2xl shadow-sm bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3">Recently Joined Units</h3>

        <div className="h-[250px] overflow-y-auto space-y-3 scrollbar-hide">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : !units || units.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No recent units
            </p>
          ) : (
            units.map((unit) => {
              const unitName = unit.name || "Unknown Unit";
              const avatarUrl = unit.avatarUrl ?? undefined;
              const address = unit.address ?? null;

              return (
                <div key={unit.userId} className="flex items-start gap-3 px-1">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                      {unitName.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-sm">{unitName}</p>

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
