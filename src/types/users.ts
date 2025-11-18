import type { User, Session } from "@supabase/supabase-js";

export interface Admin {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

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
