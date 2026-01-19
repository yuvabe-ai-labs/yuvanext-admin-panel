import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppliedCandidates } from "@/hooks/useRecentUsers";

export default function CandidateManagement() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: candidates, isLoading } = useAppliedCandidates(1, 10);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hired":
        return "bg-green-100 text-green-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      case "applied":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border border-border rounded-3xl p-8 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Candidate Management</h3>
        <button
          className="text-blue-600 font-semibold text-sm hover:text-blue-800 cursor-pointer"
          onClick={() => navigate("/candidate-management")}
        >
          View all
        </button>
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
          className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2"
        >
          {isLoading ? (
            <div className="w-full text-center py-8 text-muted-foreground">
              Loading candidates...
            </div>
          ) : !candidates || candidates.length === 0 ? (
            <div className="w-full text-center py-8 text-muted-foreground">
              No applied candidates found
            </div>
          ) : (
            candidates.map((application) => {
              const skills = application.skills ?? [];
              const interests = application.interests ?? [];
              const profileSummary =
                application.profileSummary ??
                "Passionate about creating user-centered digital experiences.";

              return (
                <Card
                  key={application.candidateId}
                  className="min-w-[350px] border border-border/50 hover:shadow-lg transition-shadow rounded-3xl flex flex-col"
                >
                  <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                    {/* Header */}
                    <div className="flex items-center gap-3 sm:gap-5">
                      {/* Avatar */}
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-green-500">
                        <AvatarImage
                          src={application.avatarUrl ?? undefined}
                          alt={application.name ?? "Candidate"}
                          className="object-cover"
                        />
                        <AvatarFallback className="font-semibold bg-gray-200 text-gray-700">
                          {application.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "C"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-900 truncate">
                          {application.name || "Unknown"}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-700 mb-2 truncate">
                          {application.internshipName || "No internship"}
                        </p>

                        <Badge
                          className={`${getStatusColor(
                            application.applicationStatus
                          )} text-xs sm:text-sm px-2 sm:px-3 py-1 capitalize`}
                        >
                          {application.applicationStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Profile Summary */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-3">
                      {profileSummary}
                    </p>

                    {/* Skills */}
                    <div className="min-h-7">
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
                      {skills.length === 0 && interests.length > 0 && (
                        <div className="flex gap-2 overflow-hidden">
                          {interests.slice(0, 3).map((interest, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] text-gray-600 bg-muted/40 rounded-full px-2 py-1 whitespace-nowrap"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border/40"></div>

                    {/* Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 text-sm py-3 rounded-full cursor-pointer"
                      onClick={() =>
                        navigate(`/candidate/${application.applicationId}`)
                      }
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
