import { useAuth } from "@/hooks/useAuth";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Database, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, admin, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Top bar */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <Button variant="destructive" onClick={signOut} className="flex gap-2">
          <LogOut size={18} />
          Logout
        </Button>
      </header>

      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">
          Welcome, {admin?.name || user?.email?.split("@")[0] || "Admin"} 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          You have full admin access.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">120</p>
            <p className="text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Total Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">5</p>
            <p className="text-muted-foreground">Registered admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-500">Good</p>
            <p className="text-muted-foreground">All services running</p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-muted-foreground">
        © {new Date().getFullYear()} Admin Console
      </footer>
    </div>
  );
}
