import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
  name: string;
  email: string;
  applications: number;
  activePosts: number;
  joinDate: string;
  logoUrl?: string;
  status: "active" | "inactive";
}

export default function CompanyCard({
  name,
  email,
  applications,
  activePosts,
  joinDate,
  logoUrl,
  status,
}: CompanyCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

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
          <span>{applications} Applications</span>
          <span>{activePosts} Active Posts</span>
          <span>Joined {joinDate}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
