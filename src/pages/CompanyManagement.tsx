import Navbar from "@/components/Navbar";
// import { ProfileIcon } from "lucide-react";
import { BagIcon, PasteIcon, ProfileIcon } from "@/components/ui/custom-icons";
import {
  useActiveInternships,
  useAllUnits,
  useProfileStats,
  useTotalApplications,
} from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompanyCard from "@/components/CompanyCard";
import { useEffect, useRef, useState } from "react";
import { Search, SearchIcon } from "lucide-react";

export default function CompanyManagement() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const [companies, setCompanies] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // ⭐ ADDED: Store total pages so we know when to stop loading
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const { data: profileStats } = useProfileStats();
  const { data: activeInternships } = useActiveInternships();
  const { data: totalApplications } = useTotalApplications();

  // RESET pagination when search changes
  useEffect(() => {
    setPage(1);
    setCompanies([]);
  }, [searchQuery]);

  const {
    data: unitsData,
    // isLoading,
    isFetching,
  } = useAllUnits(page, pageSize, searchQuery);

  // Merge page results
  useEffect(() => {
    if (unitsData?.data) {
      if (page === 1) {
        setCompanies(unitsData.data);
      } else {
        setCompanies((prev) => [...prev, ...unitsData.data]);
      }
    }

    if (unitsData?.totalPages) {
      setTotalPages(unitsData.totalPages);
    }
  }, [unitsData, page]);

  /** Intersection Observer for infinite scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        // ⭐ ADDED: Stop loading when no more pages
        if (
          target.isIntersecting &&
          !isFetching &&
          totalPages !== null &&
          page < totalPages
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isFetching, totalPages, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-30 py-8">
        {/* TOP CARDS */}
        <div className="pb-8">
          <div className="grid grid-cols-4 gap-4">
            {/* Registered Company */}
            <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-5 shadow">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Registered Company
                </p>
                <p className="text-2xl font-medium text-gray-600 mb-1">
                  {profileStats?.registeredUnits}
                </p>
                <p className="text-xs text-blue-600">+{} new this month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <ProfileIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Active Company */}
            <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-5 shadow">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Active Company
                </p>
                <p className="text-2xl font-medium text-gray-600 mb-1">
                  {profileStats?.activeUnits}
                </p>
                <p className="text-xs text-blue-600">+{} new this month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <PasteIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Active Jobs Posts */}
            <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-5 shadow">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Active Jobs Posts
                </p>
                <p className="text-2xl font-medium text-gray-600 mb-1">
                  {activeInternships?.totalInternships}
                </p>
                <p className="text-xs text-blue-600">+{} new this month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <ProfileIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Total Applications */}
            <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-5 shadow">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Total Applications
                </p>
                <p className="text-2xl font-medium text-gray-600 mb-1">
                  {totalApplications?.totalApplications}
                </p>
                <p className="text-xs text-blue-600">+{} new this month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <BagIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Company Management */}
        <Card className="border border-border rounded-3xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-600 font-semibold">
                Company Management
              </h3>
              <div className="flex justify-between items-center">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search Companies"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-50 h-6 py-3 pl-8 pr-4 rounded-full border border-gray-400 focus:outline-none placeholder:text-[12px]"
                  />
                </div>

                <Button variant="link" className="text-primary">
                  View all
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Render Loaded Companies */}
              {companies.map((company, index) => (
                <CompanyCard
                  key={index}
                  name={company.unit_profile.unit_name || ""}
                  email={company.unit_profile.contact_email || ""}
                  logoUrl={company.unit_profile.avatar_url || ""}
                  applications={0}
                  activePosts={0}
                  joinDate={
                    new Date(company.unit_profile.created_at)
                      .toISOString()
                      .split("T")[0]
                  }
                  status={"active"}
                />
              ))}

              {/* Infinite scroll loader */}
              <div
                ref={loaderRef}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                {isFetching
                  ? "Loading more companies..."
                  : page >= (totalPages || 0)
                  ? "No more companies"
                  : ""}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
