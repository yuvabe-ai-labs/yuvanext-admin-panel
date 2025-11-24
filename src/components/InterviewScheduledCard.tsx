import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface InterviewScheduledCardProps {
  id: string;
  student_name: string;
  student_avatar_url: string | null;
  internship_title: string;
  scheduled_date: string;
  duration_minutes: number;
  meeting_link: string;
  unit_name: string | null;
  unit_avatar_url: string | null;
  description?: string | null;
  job_type?: string | null;
  duration?: string | null;
  onViewProfile: (id: string) => void;
}

export default function InterviewScheduledCard({
  id,
  student_name,
  student_avatar_url,
  internship_title,
  scheduled_date,
  unit_name,
  unit_avatar_url,
  description,
  job_type,
  duration,
  onViewProfile,
}: InterviewScheduledCardProps) {
  const formatInterviewDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM dd 'at' hh:mma");
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    <Card className="border border-gray-200 hover:shadow-sm transition-all rounded-xl overflow-hidden bg-white">
      <CardContent className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            {internship_title}
          </span>
          <div className="text-right text-sm text-gray-600">
            <span>
              {duration || "Duration not specified"} | {formatJobType(job_type)}
            </span>
          </div>
        </div>

        {/* Avatars and Name Row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-3">
            <Avatar className="w-12 h-12 rounded-full ring-2 ring-white">
              <AvatarImage
                src={student_avatar_url ?? undefined}
                alt={student_name}
                className="object-cover"
              />
              <AvatarFallback className="font-semibold bg-gray-800 text-white text-sm">
                {getInitials(student_name)}
              </AvatarFallback>
            </Avatar>

            <Avatar className="w-12 h-12 rounded-full ring-2 ring-white">
              <AvatarImage
                src={unit_avatar_url ?? undefined}
                alt={unit_name ?? "Unit"}
                className="object-cover"
              />
              <AvatarFallback className="font-semibold bg-gray-900 text-white text-sm">
                {unit_name ? getInitials(unit_name) : "X"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 mb-0.5">
              {student_name}
            </h3>
            <p className="text-sm text-gray-600">
              Interview scheduled with{" "}
              <span className="font-medium">{unit_name}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {description ||
            `UX/UI designer with 5+ years of experience crafting user-centered digital experiences. Passionate about using design to solve problems and connect people with technology.`}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-600">
              Interview on {formatInterviewDate(scheduled_date)}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg px-4 py-1.5 h-auto text-sm font-medium flex-shrink-0"
            onClick={() => onViewProfile(id)}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
