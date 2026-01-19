import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { useRecentCandidates } from "@/hooks/useRecentUsers";

export default function RecentCandidates() {
  const { data: candidates, isLoading } = useRecentCandidates(1, 10);

  return (
    <Card className="border border-border rounded-2xl shadow-sm bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3">
          Recently Joined Candidates
        </h3>

        <div className="h-[250px] overflow-y-auto space-y-3 scrollbar-hide">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : !candidates || candidates.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No recent candidates
            </p>
          ) : (
            candidates.map((candidate) => {
              const fullName = candidate.name || "Unknown";
              const avatarUrl = candidate.avatarUrl ?? undefined;
              const profileType = candidate.type ?? null;
              const location = candidate.location ?? null;

              return (
                <div
                  key={candidate.userId}
                  className="flex items-start gap-3 px-1"
                >
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-base">
                      {fullName.charAt(0)?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-sm">{fullName}</p>

                    {profileType && (
                      <p className="text-[12px] text-muted-foreground capitalize">
                        {profileType}
                      </p>
                    )}

                    {location && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
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
