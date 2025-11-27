import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const Courses = () => {
  // const navigate = useNavigate();
  const { courses: allCourses, loading: coursesLoading } = useCourses();
  const [providers, setProviders] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [filters, setFilters] = useState({
    providers: [] as string[],
    titles: [] as string[],
    difficulty: [] as string[],
    postingDate: { from: "", to: "" },
  });

  const [, setActiveDateRange] = useState("");
  const [showMobileFilters] = useState(false);

  // Fetch course providers
  useEffect(() => {
    const fetchProviders = async () => {
      const uniqueCreatorIds = [
        ...new Set(allCourses.map((c) => c.created_by)),
      ];

      const { data } = await supabase
        .from("units")
        .select("id, unit_name")
        .in("id", uniqueCreatorIds);

      if (data) {
        setProviders(data.map((p) => ({ id: p.id, name: p.unit_name ?? "" })));
      }
    };

    if (allCourses.length > 0) {
      fetchProviders();
    }
  }, [allCourses]);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden"; // ✅ stop background scroll
    } else {
      document.body.style.overflow = "auto"; // ✅ restore scrolling
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileFilters]);

  const resetFilters = () => {
    setFilters({
      providers: [],
      titles: [],
      difficulty: [],
      postingDate: { from: "", to: "" },
    });
    setActiveDateRange("");
  };

  const parsePgTimestamp = (ts: any): Date => {
    if (ts instanceof Date) return ts;
    if (!ts) return new Date(NaN);
    let s = String(ts).trim();
    s = s
      .replace(" ", "T")
      .replace(/\.(\d{3})\d+/, ".$1")
      .replace(/\+00:00?$|Z$/i, "Z");
    if (!/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s)) s = s + "Z";
    return new Date(s);
  };

  const filteredCourses = allCourses.filter((course) => {
    // Filter by provider
    if (filters.providers.length) {
      const providerName = providers.find(
        (p) => p.id === course.created_by
      )?.name;
      if (!providerName || !filters.providers.includes(providerName))
        return false;
    }

    // Filter by title
    if (filters.titles.length && !filters.titles.includes(course.title))
      return false;

    // Filter by difficulty
    if (
      filters.difficulty.length &&
      !filters.difficulty.includes(course.difficulty_level || "")
    )
      return false;

    // Filter by posting date
    if (filters.postingDate.from || filters.postingDate.to) {
      const courseDate = parsePgTimestamp(course.created_at).getTime();
      const from = filters.postingDate.from
        ? new Date(filters.postingDate.from).getTime()
        : -Infinity;
      const to = filters.postingDate.to
        ? new Date(filters.postingDate.to).getTime()
        : Infinity;
      if (Number.isNaN(courseDate)) return false;
      if (courseDate < from || courseDate > to) return false;
    }

    return true;
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 sm:px-6 md:mx-auto py-4 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Courses Grid */}
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
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
                      {course.image_url ? (
                        <img
                          src={course.image_url}
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
                        {formatDistanceToNow(new Date(course.created_at), {
                          addSuffix: true,
                        })}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Duration and Level */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration || "8 weeks"}</span>
                        </div>
                        {course.difficulty_level && (
                          <Badge
                            className={`${getDifficultyColor(
                              course.difficulty_level
                            )} text-white`}
                          >
                            {course.difficulty_level}
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
                        href={course.website_url || ""}
                        target="_blank"
                        className="w-full inline-block text-center rounded-full border py-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        Know more
                      </a>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Loading Skeletons */}
              {coursesLoading &&
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

            {!coursesLoading && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No courses found matching your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
