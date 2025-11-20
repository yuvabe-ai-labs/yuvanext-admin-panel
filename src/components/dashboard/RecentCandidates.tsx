import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

// Use any type to accept whatever your API returns
interface RecentCandidatesProps {
  students: any[];
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
            students.map((student) => (
              <div
                key={student.profile.id}
                className="flex items-start gap-3 px-1"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={student.student_profile?.avatar_url || undefined}
                  />
                  <AvatarFallback className="text-base">
                    {student.profile.full_name?.charAt(0).toUpperCase() || "S"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 leading-tight">
                  <p className="font-medium text-sm">
                    {student.profile.full_name}
                  </p>

                  {student.student_profile?.headline && (
                    <p className="text-[12px] text-muted-foreground">
                      {student.student_profile.headline}
                    </p>
                  )}

                  {student.student_profile?.location && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {student.student_profile.location}
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
