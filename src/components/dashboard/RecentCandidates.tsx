import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import type { StudentProfileData } from "@/types/profile.types";

interface RecentCandidatesProps {
  students: StudentProfileData[];
  isLoading: boolean;
}

export default function RecentCandidates({
  students,
  isLoading,
}: RecentCandidatesProps) {
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
          ) : students.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No recent candidates
            </p>
          ) : (
            students.map((student) => {
              const { profile, student_profile } = student;

              const fullName = profile?.full_name;
              const avatarUrl = student_profile?.avatar_url ?? undefined;
              const profile_type = student_profile?.profile_type ?? null;
              const location = student_profile?.location ?? null;

              return (
                <div key={profile.id} className="flex items-start gap-3 px-1">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-base">
                      {fullName.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-sm">{fullName}</p>

                    {profile_type && (
                      <p className="text-[12px] text-muted-foreground">
                        {profile_type}
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
