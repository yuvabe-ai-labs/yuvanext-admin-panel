import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCourses } from "@/hooks/useCourses";

const Courses = () => {
  const { data: courses = [], isLoading } = useCourses();

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-orange-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 sm:px-6 md:mx-auto py-4 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Courses Grid */}
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const gradients = [
                  "bg-gradient-to-br from-lime-400 to-green-600",
                  "bg-gradient-to-br from-purple-500 to-pink-600",
                  "bg-gradient-to-br from-blue-500 to-cyan-400",
                  "bg-gradient-to-br from-orange-500 to-red-600",
                  "bg-gradient-to-br from-teal-500 to-blue-600",
                  "bg-gradient-to-br from-yellow-500 to-orange-600",
                ];
                const gradient =
                  gradients[Math.floor(Math.random() * gradients.length)];

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden rounded-3xl hover:shadow-lg transition-all"
                  >
                    {/* Course Image/Gradient Header */}
                    <div
                      className={`h-40 ${gradient} relative flex items-center justify-center`}
                    >
                      {course.bannerUrl ? (
                        <img
                          src={course.bannerUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-center">
                          <h3 className="text-2xl font-bold">
                            {course.category || "Course"}
                          </h3>
                        </div>
                      )}
                      {/* Time ago badge */}
                      <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                        {getTimeAgo(course.createdAt)}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Duration and Level */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration || "8 weeks"}</span>
                        </div>
                        {course.difficultyLevel && (
                          <Badge
                            className={`${getDifficultyColor(
                              course.difficultyLevel
                            )} text-white`}
                          >
                            {course.difficultyLevel}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description ||
                          "Build your skills with this comprehensive course..."}
                      </p>

                      {/* Know More Button */}
                      <a
                        href={course.redirectUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-block text-center rounded-full border py-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        Know more
                      </a>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Loading Skeletons */}
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={`skeleton-${i}`}
                    className="overflow-hidden rounded-xl"
                  >
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-10 w-full rounded-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>

            {!isLoading && courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No courses available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
