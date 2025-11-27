import Navbar from "@/components/Navbar";
import {
  BagIcon,
  DoubleProfileIcon,
  PasteIcon,
  ProfileIcon,
} from "@/components/ui/custom-icons";
import {
  useActiveInternships,
  // useAllUnits,
  useProfileStats,
  useTotalApplications,
} from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronLeft, SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddCompanyForm from "@/components/AddCompanyForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useInfiniteUnits } from "@/hooks/useInfiniteUnits";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UnitManagement from "@/components/UnitManagement";

export default function CompanyManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteUnits(
    10,
    searchQuery
  );
  const companies = data?.pages.flatMap((page) => page.data) || [];

  const { data: profileStats } = useProfileStats();
  const { data: activeInternships } = useActiveInternships();
  const { data: totalApplications } = useTotalApplications();
  const navigate = useNavigate();

  // const { data: unitsData, isLoading: unitsLoading } = useAllUnits(1, 10);
  // const recentUnits = unitsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-30 py-8">
        <button
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white "
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

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
                {/* <p className="text-xs text-blue-600">+{} new this month</p> */}
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <DoubleProfileIcon className="w-5 h-5 text-teal-800" />
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
                {/* <p className="text-xs text-blue-600">+{} new this month</p> */}
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <PasteIcon className="w-5 h-5 text-teal-800" />
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
                {/* <p className="text-xs text-blue-600">+{} new this month</p> */}
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <ProfileIcon className="w-5 h-5 text-teal-800" />
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
                {/* <p className="text-xs text-blue-600">+{} new this month</p> */}
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-200 flex items-center justify-center">
                <BagIcon className="w-5 h-5 text-teal-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Company List */}
        <Card className="border border-border rounded-3xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-600 font-semibold">
                Company Management
              </h3>
              <div className="flex justify-between items-center">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3.5 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search Companies"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 h-6 py-3 pl-8 pr-4 rounded-full border border-gray-400 focus:outline-none placeholder:text-[12px]"
                  />
                </div>

                <button
                  className="border px-4 rounded-full bg-teal-600 text-xs py-1.5 text-white ml-7 cursor-pointer"
                  onClick={() => setIsDialogOpen(true)}
                >
                  + Add Company
                </button>
              </div>
            </div>

            {/* 🔥 Infinite Scroll */}
            <InfiniteScroll
              style={{ overflow: "visible" }} // allow page scroll
              dataLength={companies.length}
              next={fetchNextPage}
              hasMore={hasNextPage ?? false}
              loader={<p className="py-4 text-center">Loading more...</p>}
              endMessage={
                !(companies.length == 0) && (
                  <p className="py-4 text-center text-gray-400">
                    No more companies.
                  </p>
                )
              }
            >
              {/* Company Management */}

              <UnitManagement units={companies} isLoading={!companies.length} />
            </InfiniteScroll>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-h-[80vh] overflow-y-auto max-w-3xl">
              <VisuallyHidden>
                <DialogTitle>Add Company Details</DialogTitle>
              </VisuallyHidden>
              <AddCompanyForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
}
