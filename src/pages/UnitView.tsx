import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MapPin, Clock, Ban, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUnitDetail } from "@/hooks/useViewProfile";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  ThreadIcon,
  TwitterIcon,
} from "@/components/ui/custom-icons";
import { useDeactivateAccount, useActivateAccount } from "@/hooks/useSuspend";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const UnitView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: unit, isLoading, error } = useUnitDetail(id);
  const deactivateMutation = useDeactivateAccount();
  const activateMutation = useActivateAccount();

  const handleSuspendAccount = async () => {
    if (!id) return;
    try {
      await deactivateMutation.mutateAsync(id);
      toast.success(`${unit?.name}'s account has been suspended`);
    } catch (error) {
      console.error("Error suspending account:", error);
      toast.error("Failed to suspend account. Please try again.");
    }
  };

  const handleActivateAccount = async () => {
    if (!id) return;
    try {
      await activateMutation.mutateAsync(id);
      toast.success(`${unit?.name}'s account has been reactivated`);
    } catch (error) {
      console.error("Error activating account:", error);
      toast.error("Failed to reactivate account. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Unit Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The unit you are looking for does not exist.
          </p>
          <Button onClick={() => navigate("/units")}>Back to Units</Button>
        </div>
      </div>
    );
  }

  const internships = unit.internships || [];
  // Determine if unit is active (you may need to adjust this based on your actual data structure)
  const isActive = unit.status === "active" || internships.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-70.5 bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10">
        {unit.bannerUrl && (
          <img
            src={unit.bannerUrl}
            alt={unit.name || "Unit banner"}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="md:-mt-33 pt-0 container p-0 md:px-30 md:py-10">
        {/* Hero Section with Unit Info */}
        <Card className="relative border border-gray-200 md:mb-2.5 overflow-hidden bg-white rounded-none md:rounded-3xl">
          <CardContent className="p-7.5">
            <div className="flex flex-col md:flex-row items-start gap-7">
              {/* Unit Logo */}
              <div className="hidden md:flex justify-center items-center w-32 h-32 rounded-full bg-background border-4 border-background shadow-md text-4xl font-bold text-foreground overflow-hidden">
                {unit.avatarUrl ? (
                  <img
                    src={unit.avatarUrl}
                    alt={unit.name || "Unit logo"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  unit.name?.charAt(0) || "U"
                )}
              </div>

              {/* Unit Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2 flex gap-2.5">
                  {/* Unit Logo For Mobile*/}
                  <div className="w-10 h-10 flex justify-center items-center md:hidden rounded-full bg-background border-4 border-background shadow-md text-4xl font-bold text-foreground overflow-hidden">
                    {unit.avatarUrl ? (
                      <img
                        src={unit.avatarUrl}
                        alt={unit.name || "Unit logo"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      unit.name?.charAt(0) || "U"
                    )}
                  </div>
                  {unit.name}
                </h1>
                <p className="text-muted-foreground mb-3 pr-4">
                  {unit.description ||
                    "A unit focused on creating meaningful experiences."}
                </p>

                {/* Contact Info Row */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                  {unit.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{unit.email}</span>
                    </div>
                  )}
                  {unit.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{unit.phone}</span>
                    </div>
                  )}
                  {unit.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{unit.address}</span>
                    </div>
                  )}
                </div>

                {/* Visit Website and Social Links */}
                <div className="flex gap-4 items-center">
                  {/* Social Links */}
                  {unit.socialLinks &&
                    Object.keys(unit.socialLinks).length > 0 && (
                      <div className="flex gap-4 font-bold">
                        {Object.entries(unit.socialLinks).map(
                          ([platform, url], idx) => {
                            const getSocialIcon = (platform: string) => {
                              const p = platform.toLowerCase();
                              if (p.includes("linkedin")) return LinkedinIcon;
                              if (p.includes("instagram")) return InstagramIcon;
                              if (p.includes("facebook")) return FacebookIcon;
                              if (p.includes("twitter") || p.includes("x"))
                                return TwitterIcon;
                              if (p.includes("thread")) return ThreadIcon;
                              return null;
                            };

                            const Icon = getSocialIcon(platform);
                            if (!Icon) return null;

                            return (
                              <button
                                key={idx}
                                className="bg-transparent text-[#020817] p-0"
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Icon className="w-5 h-5" />
                                </a>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}

                  {unit.websiteUrl && (
                    <button className="text-[#020817] font-medium border-gray-600 border bg-transparent px-3 py-1 rounded-full">
                      <a
                        href={unit.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </button>
                  )}

                  {/* Suspend/Activate Button with AlertDialog */}
                  {isActive ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="inline-flex items-center gap-2.5 bg-transparent rounded-full py-1 px-3 border border-red-500 cursor-pointer hover:bg-red-50 transition-colors">
                          <Ban className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-500 text-sm text-center">
                            Suspend Account
                          </span>
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Suspend this account?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will suspend {unit.name}'s account immediately.
                            They will lose access to the platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleSuspendAccount}
                            disabled={deactivateMutation.isPending}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            {deactivateMutation.isPending
                              ? "Suspending..."
                              : "Suspend Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="inline-flex items-center gap-2.5 bg-transparent rounded-full py-1 px-3 border border-green-500 cursor-pointer hover:bg-green-50 transition-colors">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-500 text-sm text-center">
                            Reactivate Account
                          </span>
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Reactivate this account?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will restore {unit.name}'s access to the
                            platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleActivateAccount}
                            disabled={activateMutation.isPending}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            {activateMutation.isPending
                              ? "Reactivating..."
                              : "Reactivate Account"}
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
        <div>
          {/* Left Column - Open Internship Positions */}
          <div>
            <div className="border border-gray-200 p-8 rounded-none md:rounded-3xl">
              <h2 className="text-xl font-medium text-foreground mb-5">
                Open Internship Positions
              </h2>

              {internships.length === 0 ? (
                <Card className="p-8 text-center border-0.5 border-gray-300">
                  <p className="text-muted-foreground">
                    No open positions at the moment.
                  </p>
                </Card>
              ) : (
                <div className="space-y-2.5">
                  {internships.map((internship) => {
                    const skillsRequired = internship.skillsRequired || [];

                    return (
                      <Card
                        key={internship.id}
                        className="border-[0.5px] border-gray-300 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Internship Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex gap-2.5">
                                  {/* Internship Icon */}
                                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                                    <span className="text-lg font-bold">
                                      {unit.avatarUrl ? (
                                        <img
                                          className="w-12 h-12 rounded-full"
                                          src={unit.avatarUrl}
                                          alt={`${unit.name} logo`}
                                        />
                                      ) : (
                                        internship.title.charAt(0)
                                      )}
                                    </span>
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                      {internship.title}
                                    </h3>
                                    {internship.duration && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{internship.duration}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* View Button */}
                                <Button
                                  variant="gradient"
                                  className="rounded-full text-white invisible md:visible cursor-pointer"
                                  onClick={() =>
                                    navigate(`/internships/${internship.id}`)
                                  }
                                >
                                  View
                                </Button>
                              </div>

                              <p className="text-sm text-gray-400 mb-3 line-clamp-2 lg:pr-[8.56rem]">
                                {internship.description}
                              </p>

                              {/* Skills */}
                              {skillsRequired.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium text-foreground">
                                    Skills:
                                  </span>
                                  {skillsRequired
                                    .slice(0, 5)
                                    .map((skill: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="text-xs text-muted-foreground"
                                      >
                                        {skill}
                                        {idx <
                                          Math.min(skillsRequired.length, 5) -
                                            1 && ","}
                                      </span>
                                    ))}
                                </div>
                              )}

                              {/* View Button Mobile */}
                              <Button
                                variant="gradient"
                                className="rounded-full bg-clip-text text-transparent border border-orange-600 visible w-full bg-transparent md:hidden mt-4"
                                onClick={() =>
                                  navigate(`/internships/${internship.id}`)
                                }
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mission & Values Section */}
        <div className="md:mt-2.5 space-y-2.5">
          <Card className="border border-gray-200 rounded-none md:rounded-3xl">
            <CardContent className="p-7">
              <h2 className="text-xl font-medium text-gray-900 mb-5">
                Mission & Values
              </h2>

              {/* Our Mission */}
              <div className="mb-2.5 border border-gray-300 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground">
                  Our Mission
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {unit.mission ||
                    "To create meaningful impact through innovative solutions and sustainable practices."}
                </p>
              </div>
              {/* Our Values */}
              <div className="border border-gray-300 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground">
                  Our Values
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {unit.values ||
                    "To create meaningful impact through innovative solutions and sustainable practices."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Glimpse of the Unit & Gallery */}
        {(() => {
          const galleryVideos = unit.galleryVideos || [];
          const galleryImages = unit.galleryImages || [];

          const hasVideo = galleryVideos.length > 0;
          const hasImages = galleryImages.length > 0;

          // If neither video nor images exist, return null
          if (!hasVideo && !hasImages) return null;

          // Show up to 3 images
          const displayImages = galleryImages.slice(0, 3);

          return (
            <Card className="md:mt-2.5 border-gray-200 rounded-none md:rounded-3xl">
              <CardContent className="p-7">
                <div className="flex items-center mb-5">
                  <h3 className="text-xl font-medium text-foreground">
                    Glimpse of the Unit
                  </h3>
                </div>

                {/* Show video only if available */}
                {hasVideo && (
                  <div className="relative w-full aspect-video bg-muted overflow-hidden mb-3">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      <source src={galleryVideos[0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Show gallery images if available */}
                {hasImages && (
                  <div className="grid grid-cols-3 gap-2.5">
                    {displayImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-muted overflow-hidden"
                      >
                        <img
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}
      </div>
    </div>
  );
};

export default UnitView;
