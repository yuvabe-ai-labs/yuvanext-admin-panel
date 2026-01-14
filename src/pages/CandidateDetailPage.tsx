import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCandidateDetail } from "@/hooks/useViewProfile";
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
  MapPin,
  ChevronLeft,
  Calendar,
  Briefcase,
} from "lucide-react";

export default function CandidateDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useCandidateDetail(applicationId);

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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Card className="p-6">
            <p className="text-red-600 mb-4">Error loading candidate profile</p>
            <Button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
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

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const education = Array.isArray(profile.education) ? profile.education : [];
  const projects = Array.isArray(profile.projects) ? profile.projects : [];
  const internships = Array.isArray(profile.internship)
    ? profile.internship
    : [];
  const courses = Array.isArray(profile.course) ? profile.course : [];
  const languages = Array.isArray(profile.language) ? profile.language : [];

  // Extract social links if they exist
  const socialLinks = profile.socialLinks
    ? typeof profile.socialLinks === "object"
      ? Object.entries(profile.socialLinks)
      : []
    : [];

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    if (platformLower.includes("linkedin")) return Linkedin;
    if (platformLower.includes("instagram")) return Instagram;
    if (platformLower.includes("facebook")) return Facebook;
    if (platformLower.includes("twitter") || platformLower.includes("x"))
      return Twitter;
    if (platformLower.includes("youtube")) return Youtube;
    if (platformLower.includes("behance")) return Palette;
    return Globe;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">
            Candidate Profile
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Profile Header Card */}
        <div className="container mx-auto px-2 py-2">
          <Card className="mb-4 rounded-3xl border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20 rounded-full">
                  <AvatarImage
                    src={profile.avatarUrl || undefined}
                    alt={profile.name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl font-semibold bg-teal-600 text-white">
                    {profile.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "NA"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    {profile.name || "Anonymous"}
                  </h2>

                  {profile.profileSummary && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {profile.profileSummary}
                    </p>
                  )}

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
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.type && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="capitalize">{profile.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Info Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.experienceLevel && (
                      <Badge variant="outline" className="px-3 py-1">
                        {profile.experienceLevel}
                      </Badge>
                    )}
                    {profile.gender && (
                      <Badge variant="outline" className="px-3 py-1 capitalize">
                        {profile.gender}
                      </Badge>
                    )}
                    {profile.maritalStatus && (
                      <Badge variant="outline" className="px-3 py-1 capitalize">
                        {profile.maritalStatus}
                      </Badge>
                    )}
                    {profile.isDifferentlyAbled && (
                      <Badge variant="outline" className="px-3 py-1">
                        Differently Abled
                      </Badge>
                    )}
                    {profile.hasCareerBreak && (
                      <Badge variant="outline" className="px-3 py-1">
                        Career Break
                      </Badge>
                    )}
                  </div>

                  {profile.dateOfBirth && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Born: {formatDate(profile.dateOfBirth)}</span>
                    </div>
                  )}
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
                  <div className="space-y-2">
                    {skills.length > 0 ? (
                      skills.map((skill: string, idx: number) => (
                        <div key={idx} className="flex items-center">
                          <Badge variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Looking For */}
              {Array.isArray(profile.lookingFor) &&
                profile.lookingFor.length > 0 && (
                  <Card className="rounded-3xl border-0 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        Looking For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.lookingFor.map((item: string, idx: number) => (
                          <Badge
                            key={idx}
                            className="bg-teal-100 text-teal-800"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Languages */}
              {languages.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Languages
                    </h3>
                    <div className="space-y-2">
                      {languages.map((lang: any, idx: number) => (
                        <div key={idx} className="text-sm text-gray-700">
                          • {typeof lang === "string" ? lang : lang.name}
                          {typeof lang === "object" && (
                            <span className="text-gray-500 ml-2">
                              (
                              {[
                                lang.read && "Read",
                                lang.write && "Write",
                                lang.speak && "Speak",
                              ]
                                .filter(Boolean)
                                .join(", ")}
                              )
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Internships */}
              {internships.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Internships
                    </h3>
                    <ul className="space-y-4">
                      {internships.map((internship: any, idx: number) => (
                        <li key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base text-gray-900">
                              {internship.title || "Internship"}
                            </span>
                          </div>
                          {internship.company && (
                            <p className="text-sm text-gray-600 mb-1">
                              {internship.company}
                            </p>
                          )}
                          {internship.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {internship.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
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
                      interests.map((interest: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="px-3 py-1 text-sm border-gray-300 text-gray-700"
                        >
                          {interest}
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
              {courses.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Completed Courses
                    </h3>
                    <ul className="space-y-4">
                      {courses.map((course: any, idx: number) => (
                        <li key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base text-gray-900">
                              {course.title || course.name || "Course"}
                            </span>
                          </div>
                          {course.provider && (
                            <p className="text-sm text-gray-600 mb-1">
                              Provider:{" "}
                              <span className="font-medium">
                                {course.provider}
                              </span>
                            </p>
                          )}
                          {course.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {course.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Projects
                    </h3>
                    <ul className="space-y-4">
                      {projects.map((project: any, idx: number) => (
                        <li key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base text-gray-900">
                              {project.title || project.name || "Project"}
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-600 leading-relaxed mb-2">
                              {project.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Education
                  </h3>
                  {education.length > 0 ? (
                    <div className="space-y-4">
                      {education.map((edu: any, idx: number) => (
                        <div key={idx} className="pb-4 border-b last:border-0">
                          <h4 className="font-semibold text-base text-gray-900">
                            {edu.degree || edu.name || "Education"}
                          </h4>
                          {edu.institution && (
                            <p className="text-sm text-gray-600">
                              {edu.institution}
                            </p>
                          )}
                          {edu.field && (
                            <p className="text-sm text-gray-600 mt-1">
                              {edu.field}
                            </p>
                          )}
                          {edu.description && (
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              {edu.description}
                            </p>
                          )}
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

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map(
                        ([platform, url]: [string, any], idx: number) => {
                          const Icon = getSocialIcon(platform);
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
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
