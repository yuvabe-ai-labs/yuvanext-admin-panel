import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useCandidateDetailedProfile,
  useSuspendCandidate,
  useRetrieveCandidate,
} from "@/hooks/useCandidates";
import {
  Mail,
  Phone,
  Loader2,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Palette,
  Globe,
  // Download,
  MapPin,
  Ban,
  UserCheck,
  ChevronLeft,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CandidateDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCandidateDetailedProfile(
    applicationId || ""
  );
  const suspendMutation = useSuspendCandidate();
  const retrieveMutation = useRetrieveCandidate();

  const handleSuspend = async () => {
    if (!data?.data?.profile_id) {
      console.error("Profile ID not found");
      return;
    }

    try {
      await suspendMutation.mutateAsync({ profileId: data.data.profile_id });
    } catch (error) {
      console.error("Error suspending candidate:", error);
    }
  };

  const handleRetrieve = async () => {
    if (!data?.data?.profile_id) {
      console.error("Profile ID not found");
      return;
    }

    try {
      await retrieveMutation.mutateAsync({ profileId: data.data.profile_id });
    } catch (error) {
      console.error("Error retrieving candidate:", error);
    }
  };

  // const handleDownloadProfile = () => {
  //   console.log("Download profile");
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Card className="p-6">
            <p className="text-red-600">Error loading candidate profile</p>
            <Button
              className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white "
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const profile = data.data;
  const isSuspended = profile.is_suspended;

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const education = Array.isArray(profile.education) ? profile.education : [];
  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  const internships = Array.isArray(profile.internships)
    ? profile.internships
    : [];
  const courses = Array.isArray(profile.completed_courses)
    ? profile.completed_courses
    : [];
  const links = Array.isArray(profile.links) ? profile.links : [];

  const getSocialIcon = (link: any) => {
    const url = (link.url || "").toLowerCase();
    const platform = (link.platform || "").toLowerCase();

    if (platform.includes("linkedin") || url.includes("linkedin.com"))
      return Linkedin;
    if (platform.includes("instagram") || url.includes("instagram.com"))
      return Instagram;
    if (platform.includes("facebook") || url.includes("facebook.com"))
      return Facebook;
    if (
      platform.includes("twitter") ||
      platform.includes("x") ||
      url.includes("twitter.com") ||
      url.includes("x.com")
    )
      return Twitter;
    if (platform.includes("youtube") || url.includes("youtube.com"))
      return Youtube;
    if (platform.includes("behance") || url.includes("behance.net"))
      return Palette;
    return Globe;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white "
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">
            Applied for "{profile.internship_title}"
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Suspended Account Banner */}
        {isSuspended && (
          <Card className="mb-4 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <Ban className="w-5 h-5" />
                <span className="font-semibold">
                  This account is currently suspended
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Header Card */}
        <div className="container mx-auto px-2 py-2">
          <Card className="mb-4 rounded-3xl border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20 rounded-full">
                  <AvatarImage
                    src={profile.avatar_url || undefined}
                    alt={profile.full_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl font-semibold bg-teal-600 text-white">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    {profile.full_name}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {profile.cover_letter}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-5">
                    {profile.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Chennai, Tamil Nadu</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {/* <Button
                      onClick={handleDownloadProfile}
                      className="gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-5"
                    >
                      <Download className="w-4 h-4" />
                      Download Profile
                    </Button> */}

                    {isSuspended ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="gap-2 border-green-300 text-green-600 hover:bg-green-50 rounded-lg px-5"
                            disabled={retrieveMutation.isPending}
                          >
                            {retrieveMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                            Reactivate Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reactivate this account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will restore {profile.full_name}'s account
                              access. They will be able to use the platform
                              normally again.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleRetrieve}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              Reactivate Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="gap-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg px-5"
                            disabled={suspendMutation.isPending}
                          >
                            {suspendMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                            Suspend Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to suspend this account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will suspend {profile.full_name}'s
                              account. They will not be able to access the
                              platform until their account is reactivated. This
                              action can be reversed later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleSuspend}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Suspend Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[30%_69%] gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Skills & Expertise */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Skills & Expertise
                  </h3>
                  <div className="space-y-3">
                    {skills.length > 0 ? (
                      skills.map((skill: any, idx: number) => {
                        const skillName =
                          typeof skill === "string" ? skill : skill.name;
                        return (
                          <div key={idx} className="flex items-center">
                            <span className="text-sm text-gray-700">
                              {skillName}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Internships */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Internships
                  </h3>
                  {internships.length > 0 ? (
                    <ul className="space-y-4">
                      {internships.map((internship: any, idx: number) => (
                        <li key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base text-gray-900">
                              {internship.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {internship.is_current
                                ? "Ongoing"
                                : internship.start_date && internship.end_date
                                ? `${new Date(
                                    internship.start_date
                                  ).toLocaleDateString()} - ${new Date(
                                    internship.end_date
                                  ).toLocaleDateString()}`
                                : internship.duration || ""}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-1">
                            Company:{" "}
                            <span className="font-medium text-gray-900">
                              {internship.company || "—"}
                            </span>
                          </p>

                          {internship.description ? (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {internship.description}
                            </p>
                          ) : (
                            <span className="italic text-gray-500 text-sm">
                              No description available
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No internships listed
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Interests */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.length > 0 ? (
                      interests.map((interest: any, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="px-3 py-1 text-sm border-gray-300 text-gray-700"
                        >
                          {typeof interest === "string"
                            ? interest
                            : interest.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No interests listed
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Completed Courses */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Completed Courses
                  </h3>
                  {courses.length > 0 ? (
                    <ul className="space-y-4">
                      {courses.map((course: any, idx: number) => (
                        <li key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base text-gray-900">
                              {course.title || course.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {course.completion_date
                                ? new Date(
                                    course.completion_date
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Provider:{" "}
                            <span className="font-medium text-gray-900">
                              {course.provider || "—"}
                            </span>
                          </p>
                          {course.certificate_url ? (
                            <a
                              href={course.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:underline text-sm"
                            >
                              View Certificate
                            </a>
                          ) : (
                            <span className="italic text-gray-500 text-sm">
                              No certificate available
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No completed courses listed
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Projects
                  </h3>
                  {projects.length > 0 ? (
                    <ul className="space-y-4">
                      {projects.map((project: any, idx: number) => (
                        <li key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base text-gray-900">
                              {project.title || project.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {project.is_current
                                ? "Ongoing"
                                : project.start_date && project.end_date
                                ? `${new Date(
                                    project.start_date
                                  ).toLocaleDateString()} - ${new Date(
                                    project.end_date
                                  ).toLocaleDateString()}`
                                : ""}
                            </span>
                          </div>

                          {project.description && (
                            <p className="text-sm text-gray-600 leading-relaxed mb-2">
                              {project.description}
                            </p>
                          )}

                          {project.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.technologies.map(
                                (tech: string, techIdx: number) => (
                                  <span
                                    key={techIdx}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          {project.project_url ? (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:underline text-sm"
                            >
                              View Project
                            </a>
                          ) : (
                            <span className="italic text-gray-500 text-sm">
                              No project link available
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No projects listed</p>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Education
                  </h3>
                  {education.length > 0 ? (
                    <div className="space-y-4">
                      {education.map((edu: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between pb-4 border-b last:border-0"
                        >
                          <div>
                            <h4 className="font-semibold text-base text-gray-900">
                              {edu.degree || edu.name || "Education"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {edu.institution ||
                                edu.school ||
                                edu.college ||
                                "Educational Institution"}
                            </p>
                            {edu.field_of_study && (
                              <p className="text-sm text-gray-600 mt-1">
                                {edu.field_of_study}
                              </p>
                            )}
                            {edu.description && (
                              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {edu.start_year || edu.start_date || ""}{" "}
                              {(edu.start_year || edu.start_date) && "-"}{" "}
                              {edu.end_year ||
                                edu.end_date ||
                                edu.year ||
                                "Present"}
                            </p>
                            {(edu.score || edu.grade || edu.gpa) && (
                              <p className="text-sm text-teal-600 font-semibold">
                                {edu.score || edu.grade || `GPA: ${edu.gpa}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No education records
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Links
                  </h3>

                  <div className="flex flex-wrap gap-3 items-center">
                    {links.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {links.map((link: any, idx: number) => {
                          const Icon = getSocialIcon(link);
                          const url =
                            typeof link === "string" ? link : link.url;
                          return (
                            <Button
                              key={idx}
                              variant="outline"
                              size="icon"
                              className="rounded-full w-10 h-10 border-gray-300 hover:bg-gray-50"
                              asChild
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Icon className="w-4 h-4 text-gray-700" />
                              </a>
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No links provided</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
