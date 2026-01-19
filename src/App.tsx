import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useSession } from "@/lib/auth-client";

import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import CompanyManagement from "./pages/CompanyManagement";
import UnitView from "./pages/UnitView";
import Courses from "./pages/Courses";
import Internships from "./pages/Internships";
import InternshipDetailsPage from "@/pages/InternshipDetailsPage";
import CandidateManagement from "./pages/CandidateManagement";
import CandidateDetailPage from "@/pages/CandidateDetailPage";
import UnitCandidateTasks from "./pages/UnitCandidateTasks";
import EnvironmentIndicator from "@/components/EnvironmentIndicator";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if ((session.user as any).role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session?.user && (session.user as any).role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* Visual differentiator for branches */}
      <EnvironmentIndicator />

      <BrowserRouter>
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-management"
            element={
              <ProtectedRoute>
                <CompanyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute>
                <Internships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/:id"
            element={
              <ProtectedRoute>
                <InternshipDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-management"
            element={
              <ProtectedRoute>
                <CandidateManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/:applicationId"
            element={
              <ProtectedRoute>
                <CandidateDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-tasks/:applicationId"
            element={
              <ProtectedRoute>
                <UnitCandidateTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/units/:id"
            element={
              <ProtectedRoute>
                <UnitView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
