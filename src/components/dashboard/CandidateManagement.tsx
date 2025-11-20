import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRef } from "react";

interface UICandidate {
  id: string;
  name: string;
  role: string;
  location?: string | null;
  bio?: string[] | string | null;
  skills?: string[] | null;
  avatar_url?: string | null;
}

interface CandidateManagementProps {
  candidates: UICandidate[];
}

export default function CandidateManagement({
  candidates,
}: CandidateManagementProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <Card className="border border-border rounded-3xl p-8 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Candidate Management</h3>
        <button className="text-primary text-sm">View all</button>
      </div>

      <div className="relative mt-4">
        <button
          onClick={() => handleScroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => handleScroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-8"
        >
          {candidates.map((candidate) => {
            const skills = candidate.skills ?? [];
            const bio = Array.isArray(candidate.bio)
              ? candidate.bio.join(" ")
              : candidate.bio ?? "";

            return (
              <Card
                key={candidate.id}
                className="min-w-[320px] border border-border/50 hover:shadow-lg transition-shadow rounded-3xl flex flex-col"
              >
                <CardContent className="p-4 sm:p-6 space-y-4 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 ring-4 ring-green-500">
                      <AvatarImage src={candidate.avatar_url ?? undefined} />
                      <AvatarFallback className="font-semibold">
                        {candidate.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1 text-gray-900 truncate">
                        {candidate.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {candidate.role}
                      </p>

                      {candidate.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {candidate.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {bio}
                  </p>

                  {/* Skills */}
                  <div className="min-h-[28px]">
                    {skills.length > 0 && (
                      <div className="flex gap-2 overflow-hidden">
                        {skills.length > 3 ? (
                          <>
                            {skills.slice(0, 3).map((skill, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                              >
                                {skill}
                              </Badge>
                            ))}
                            <Badge
                              variant="outline"
                              className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                            >
                              +{skills.length - 3}
                            </Badge>
                          </>
                        ) : (
                          skills.map((skill, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                            >
                              {skill}
                            </Badge>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border/40"></div>

                  {/* Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 text-sm py-3 rounded-full mt-auto"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
