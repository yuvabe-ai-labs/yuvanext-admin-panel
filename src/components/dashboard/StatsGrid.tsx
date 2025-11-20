import companies from "@/assets/companies.svg";
import candidates from "@/assets/candidates.svg";
import active_posts from "@/assets/active_posts.svg";
import courses from "@/assets/courses.svg";
import hired from "@/assets/hired.svg";
import platformhealth from "@/assets/platformhealth.svg";

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  subtext: string;
  bgColor: string;
}

const StatCard = ({ icon, label, value, subtext, bgColor }: StatCardProps) => (
  <div className={`${bgColor} rounded-2xl p-4`}>
    <div className="flex items-start gap-3">
      <img src={icon} className="w-10 h-10" alt={label} />
      <div>
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-primary">{subtext}</p>
      </div>
    </div>
  </div>
);

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
  const stats = [
    {
      icon: companies,
      label: "Companies",
      value: totalUnits,
      subtext: `+${newUnitsThisMonth} new this month`,
      bgColor: "bg-blue-50",
    },
    {
      icon: candidates,
      label: "Candidates",
      value: totalStudents,
      subtext: `+${newStudentsThisMonth} new this month`,
      bgColor: "bg-orange-50",
    },
    {
      icon: active_posts,
      label: "Active Posts",
      value: 16,
      subtext: "+2 new this month",
      bgColor: "bg-yellow-50",
    },
    {
      icon: courses,
      label: "Courses",
      value: 12,
      subtext: "+3 new this month",
      bgColor: "bg-indigo-50",
    },
    {
      icon: hired,
      label: "Hired",
      value: 25,
      subtext: "+5 new this month",
      bgColor: "bg-pink-50",
    },
    {
      icon: platformhealth,
      label: "Platform Health",
      value: "98%",
      subtext: "Stable this month",
      bgColor: "bg-teal-50",
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
