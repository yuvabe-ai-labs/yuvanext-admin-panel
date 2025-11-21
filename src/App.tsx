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

import { AuthProvider, useAuth } from "@/hooks/useAuth";

import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import CompanyManagement from "./pages/CompanyManagement";
import Internships from "./pages/Internships";
import InternshipDetailsPage from "@/components/InternshipDetailsPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If logged in but not admin, redirect to unauthorized
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

//  PUBLIC ROUTE (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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

            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
