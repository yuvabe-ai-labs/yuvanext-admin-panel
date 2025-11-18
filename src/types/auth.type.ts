import type { User, Session } from "@supabase/supabase-js";
import type { Admin } from "@/types/users.type";

export interface AuthState {
  user: User | null;
  session: Session | null;
  admin: Admin | null;
  loading: boolean;
  isAdmin: boolean;
}

export interface SignInResponse {
  error: Error | null;
  data?: {
    user: User;
    session: Session;
    admin: Admin;
  };
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}