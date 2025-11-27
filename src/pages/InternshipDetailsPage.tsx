import { useParams, useNavigate } from "react-router-dom";
import { useInternshipById } from "@/hooks/useInternships";
import type { InternshipDetailsView } from "@/types/internship.types";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Clock, IndianRupee, Check } from "lucide-react";

export default function InternshipDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: internshipData, isLoading } = useInternshipById(id || "");

  const internship = internshipData?.data as InternshipDetailsView | undefined;

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading internship details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Internship not found</p>
            <Button
              onClick={handleBack}
              className="mt-4 bg-teal-600 hover:bg-teal-700"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white "
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-5">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {internship.title}
                </h1>
                <p className="text-lg text-gray-700 mb-3 font-medium">
                  {internship.company_name}
                </p>
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                  {internship.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                      {internship.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                    {internship.duration}
                  </div>
                  {internship.payment && (
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1.5 text-gray-500" />
                      Paid - {internship.payment}
                    </div>
                  )}
                  {internship.job_type && (
                    <div className="flex items-center">
                      {internship.job_type === "full_time"
                        ? "Full Time"
                        : internship.job_type === "part_time"
                        ? "Part Time"
                        : internship.job_type === "both"
                        ? "Full Time & Part Time"
                        : internship.job_type}
                    </div>
                  )}
                  {internship.min_age_required && (
                    <div className="flex items-center">
                      Minimum Age: {internship.min_age_required}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About the Internship */}
          <div className="border-t border-gray-200 mb-8"></div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About the Internship
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {internship.description}
            </div>
          </div>

          {/* Key Responsibilities */}
          {internship.responsibilities &&
            internship.responsibilities.length > 0 && (
              <>
                <div className="border-t border-gray-200 mb-8"></div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Key Responsibilities
                  </h2>
                  <div className="space-y-3">
                    {internship.responsibilities.map(
                      (responsibility, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {responsibility}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

          {/* Benefits */}
          {internship.benefits && internship.benefits.length > 0 && (
            <>
              <div className="border-t border-gray-200 mb-8"></div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What You Will Get
                </h2>
                <div className="space-y-3">
                  {internship.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Skills Required */}
          {internship.skills_required &&
            internship.skills_required.length > 0 && (
              <>
                <div className="border-t border-gray-200 mb-8"></div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Required Skills
                  </h2>
                  <div className="space-y-3">
                    {internship.skills_required.map((skill, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          {/* Additional Info */}
          {internship.application_deadline && (
            <>
              <div className="border-t border-gray-200 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Application Deadline
                  </h3>
                  <p className="text-gray-700">
                    {new Date(
                      internship.application_deadline
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
