import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Admin } from "@/types/users.type";
import { signInService, signOutService } from "@/services/auth.service";
import { getAdminByUserId } from "@/services/admin.service";
import type { AuthContextType } from "@/types/auth.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;
    let initialLoadComplete = false;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Check admin status
          const adminResult = await getAdminByUserId(currentSession.user.id);

          if (!mounted) return;

          if (adminResult.data) {
            setAdmin(adminResult.data);
            setIsAdmin(true);
          } else {
            setAdmin(null);
            setIsAdmin(false);
          }
        } else {
          setSession(null);
          setUser(null);
          setAdmin(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setAdmin(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          initialLoadComplete = true;
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      console.log("Auth state changed:", event);

      // Skip INITIAL_SESSION event since we handle it in initializeAuth
      if (event === "INITIAL_SESSION") {
        return;
      }

      // Only process auth changes after initial load is complete
      if (!initialLoadComplete) {
        return;
      }

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);

        // Check admin status on auth change
        const adminResult = await getAdminByUserId(currentSession.user.id);

        if (!mounted) return;

        if (adminResult.data) {
          setAdmin(adminResult.data);
          setIsAdmin(true);
        } else {
          setAdmin(null);
          setIsAdmin(false);
        }
      } else {
        setSession(null);
        setUser(null);
        setAdmin(null);
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInService(email, password);

    if (result.data) {
      setUser(result.data.user);
      setSession(result.data.session);
      setAdmin(result.data.admin);
      setIsAdmin(true);
    } else if (result.error) {
      // If error is about authorization, the user is logged in but not admin
      // We need to check if there's a session
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession?.user) {
        // User is authenticated but not an admin
        setUser(currentSession.user);
        setSession(currentSession);
        setAdmin(null);
        setIsAdmin(false);
      }
    }

    return result;
  };

  const signOut = async () => {
    await signOutService();
    setUser(null);
    setSession(null);
    setAdmin(null);
    setIsAdmin(false);
  };

  const refreshAdmin = async () => {
    if (!user) return;

    const adminResult = await getAdminByUserId(user.id);
    if (adminResult.data) {
      setAdmin(adminResult.data);
      setIsAdmin(true);
    } else {
      setAdmin(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        admin,
        loading,
        isAdmin,
        signIn,
        signOut,
        refreshAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
