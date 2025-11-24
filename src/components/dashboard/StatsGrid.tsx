import {
  Companies,
  Hired,
  Platformhealth,
  Courses as CoursesIcon,
  Posts,
  Candidates,
} from "@/components/ui/custom-icons";

import {
  useActiveInternships,
  useActiveCourses,
  useHiredStats,
} from "@/hooks/useProfile";

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
      {/* TOP ROW → icon, label, value */}
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

      {/* NEW THIS MONTH → placed like the screenshot */}
      <p className="text-xs text-green-600 font-medium mt-2 ml-1">{subtext}</p>
    </div>
  );
};

interface StatsGridProps {
  totalUnits: number;
  totalStudents: number;
  newUnitsThisMonth: number;
  newStudentsThisMonth: number;
}

export default function StatsGrid({
  totalUnits,
  totalStudents,
  newUnitsThisMonth,
  newStudentsThisMonth,
}: StatsGridProps) {
  const navigate = useNavigate();

  const { data: activeInternshipsData, isLoading: isLoadingInternships } =
    useActiveInternships();

  const activePostsCount = activeInternshipsData?.totalInternships || 0;
  const activePostsThisMonth = activeInternshipsData?.internshipsThisMonth || 0;

  const { data: activeCoursesData, isLoading: isLoadingCourses } =
    useActiveCourses();

  const activeCoursesCount = activeCoursesData?.totalCourses || 0;
  const activeCoursesThisMonth = activeCoursesData?.coursesThisMonth || 0;

  const { data: hiredStatsData, isLoading: isLoadingHired } = useHiredStats();

  const totalHiredCount = hiredStatsData?.totalHired || 0;
  const hiredThisMonth = hiredStatsData?.hiredThisMonth || 0;

  const stats = [
    {
      icon: Companies,
      label: "Companies",
      value: totalUnits,
      subtext: `+${newUnitsThisMonth} new this month`,
      bgColor: "bg-blue-50",
      isLoading: false,
      onClick: () => navigate("/company-management"),
    },
    {
      icon: Candidates,
      label: "Candidates",
      value: totalStudents,
      subtext: `+${newStudentsThisMonth} new this month`,
      bgColor: "bg-orange-50",
      onClick: () => navigate("/candidate-management"),
    },
    {
      icon: Posts,
      label: "Active Posts",
      value: activePostsCount,
      subtext: `+${activePostsThisMonth} new this month`,
      bgColor: "bg-yellow-50",
      isLoading: isLoadingInternships,
      onClick: () => navigate("/internships"),
    },
    {
      icon: CoursesIcon,
      label: "Courses",
      value: activeCoursesCount,
      subtext: `+${activeCoursesThisMonth} new this month`,
      bgColor: "bg-indigo-50",
      isLoading: isLoadingCourses,
      onClick: () => navigate("/course-management"),
    },
    {
      icon: Hired,
      label: "Hired",
      value: totalHiredCount,
      subtext: `+${hiredThisMonth} new this month`,
      bgColor: "bg-pink-50",
      isLoading: isLoadingHired,
      onClick: () => navigate("/candidate-management"),
    },
    {
      icon: Platformhealth,
      label: "Platform Health",
      value: "98%",
      subtext: "Stable this month",
      bgColor: "bg-teal-50",
      isLoading: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
