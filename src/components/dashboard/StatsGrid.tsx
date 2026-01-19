import React, { useMemo } from "react";
import {
  Companies,
  Hired,
  Platformhealth,
  Courses as CoursesIcon,
  Posts,
  Candidates,
} from "@/components/ui/custom-icons";

import { useAdminStatsOverview } from "@/hooks/useStats";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number | string;
  subtext: string;
  bgColor: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  bgColor,
  isLoading,
  onClick,
}: StatCardProps) => {
  return (
    <div
      className={`${bgColor} rounded-2xl p-4 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-10 h-10" />
        <div>
          <p className="text-xs font-medium text-gray-600">{label}</p>
          {isLoading ? (
            <div className="h-9 w-12 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-3xl font-bold">{value}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-green-600 font-medium mt-2 ml-1">{subtext}</p>
    </div>
  );
};
export default function StatsGrid() {
  const navigate = useNavigate();
  const { data: statsData, isLoading } = useAdminStatsOverview();

  const stats = useMemo(() => {
    return [
      {
        icon: Companies,
        label: "Companies",
        value: statsData?.totalUnits || 0,
        subtext: `+${statsData?.newUnitsThisMonth || 0} new this month`,
        bgColor: "bg-blue-50",
        isLoading,
        onClick: () => navigate("/company-management"),
      },
      {
        icon: Candidates,
        label: "Candidates",
        value: statsData?.totalCandidates || 0,
        subtext: `+${statsData?.newCandidatesThisMonth || 0} new this month`,
        bgColor: "bg-orange-50",
        isLoading,
        onClick: () => navigate("/candidate-management"),
      },
      {
        icon: Posts,
        label: "Active Posts",
        value: statsData?.totalActiveInternships || 0,
        subtext: `+${statsData?.newInternshipsThisMonth || 0} new this month`,
        bgColor: "bg-yellow-50",
        isLoading,
        onClick: () => navigate("/internships"),
      },
      {
        icon: CoursesIcon,
        label: "Courses",
        value: statsData?.totalCourses || 0,
        subtext: `+${statsData?.newCoursesThisMonth || 0} new this month`,
        bgColor: "bg-indigo-50",
        isLoading,
        onClick: () => navigate("/courses"),
      },
      {
        icon: Hired,
        label: "Hired",
        value: statsData?.totalHiredCandidates || 0,
        subtext: `+${statsData?.newHiresThisMonth || 0} new this month`,
        bgColor: "bg-pink-50",
        isLoading,
        onClick: () => navigate("/candidate-management"),
      },
      {
        icon: Platformhealth,
        label: "Platform Health",
        value: `${statsData?.healthPercentage || 0}%`,
        subtext: "Stable this month",
        bgColor: "bg-teal-50",
        isLoading,
      },
    ];
  }, [statsData, isLoading, navigate]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
