import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HiredCandidateCardProps {
  id: string;
  name: string;
  avatar_url: string | null;
  internship_title: string;
  duration?: string | null;
  job_type?: string | null;
  unit_name?: string | null;
  unit_avatar_url?: string | null;
}

export default function HiredCandidateCard({
  name,
  avatar_url,
  internship_title,
  duration,
  job_type,
  unit_name,
  unit_avatar_url,
}: HiredCandidateCardProps) {
  const formatJobType = (type: string | null | undefined) => {
    if (!type) return "Not specified";

    // Convert job_type enum to readable format
    const jobTypeMap: { [key: string]: string } = {
      full_time: "Full time",
      part_time: "Part time",
      contract: "Contract",
      internship: "Internship",
    };

    return jobTypeMap[type] || type;
  };

  return (
    <Card className="border border-gray-200 rounded-3xl hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">{internship_title}</p>

            <div className="flex items-center gap-4">
              {/* Avatar with Unit Logo Overlay */}
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={avatar_url || undefined}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gray-200">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Unit Logo Badge - positioned bottom-right */}
                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
                  {unit_avatar_url ? (
                    <img
                      src={unit_avatar_url}
                      alt={unit_name || "Unit"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {unit_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "UN"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Hired Status */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    Hired by {unit_name || "Unknown Unit"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Duration Info */}
          <div className="text-right text-sm text-gray-600">
            <span>
              {duration || "Duration not specified"} | {formatJobType(job_type)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
