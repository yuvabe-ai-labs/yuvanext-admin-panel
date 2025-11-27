import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Ban, EyeIcon, EllipsisVertical, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTotalInternshipByUnit,
  useUnitApplicationCount,
} from "@/hooks/useProfile";
import { suspendUnit } from "@/services/suspend.service";

interface CompanyCardProps {
  name: string;
  email: string;
  applications: number;
  activePosts: number;
  joinDate: string;
  logoUrl?: string;
  id?: string;
  profileId?: string;
  status: "active" | "inactive";
}

export default function CompanyCard({
  name,
  email,
  joinDate,
  logoUrl,
  status,
  id,
  profileId,
}: CompanyCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
  const navigate = useNavigate();
  const { data: UnitApplicationCount } = useUnitApplicationCount(
    profileId ?? ""
  );
  const { data: TotalInternshipByUnit } = useTotalInternshipByUnit(
    profileId ?? ""
  );

  const [openMenuId, setOpenMenuId] = useState("");

  function handleToggle(id: string) {
    setOpenMenuId(openMenuId === id ? "" : id);
  }

  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-xl hover:shadow-sm transition-shadow">
      <Avatar className="h-14 w-14 rounded-full border border-border">
        <AvatarImage src={logoUrl} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground font-semibold rounded-xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
          <Badge className="bg-green-500 hover:bg-green-500 text-white border-0 font-medium">
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate mb-1">{email}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{UnitApplicationCount?.totalApplications} Applications</span>
          <span>
            {TotalInternshipByUnit?.totalInternshipsByUnit} Active Posts
          </span>
          <span>Joined {joinDate}</span>
        </div>
      </div>

      <div className="relative">
        {openMenuId === email && (
          <div
            className={`absolute bg-white top-8 left-[-120px] border border-gray-200 rounded-xl shadow-lg z-50`}
          >
            <div className="flex gap-2.5 items-center border-b border-gray-300 px-3 py-2">
              <EyeIcon className="w-5 h-5 text-gray-600" />
              <button
                className="text-xs text-gray-600 cursor-pointer"
                onClick={() => navigate(`/units/${id}`)}
              >
                View Details
              </button>
            </div>

            <div className="flex gap-2.5 items-center border-b border-gray-300 px-3 py-2">
              <UserRoundCog className="w-5 h-5 text-gray-600" />
              <button className="text-xs text-gray-600 cursor-pointer">
                Manage Access
              </button>
            </div>

            <div className="flex gap-2.5 items-center px-3 py-2">
              <Ban className="w-5 h-5 text-red-500" />
              <button
                onClick={() => suspendUnit(id || "")}
                className="text-xs text-red-500 cursor-pointer"
              >
                Suspend Account
              </button>
            </div>
          </div>
        )}

        <Button
          onClick={() => handleToggle(email)}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
