import { supabase } from "@/integrations/supabase/client";
import type { SignInResponse } from "@/types/users";
import { getAdminByUserId } from "./admin.service";

export const signInService = async (
  email: string,
  password: string
): Promise<SignInResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    if (!data.user || !data.session) {
      return { error: new Error("Invalid login response") };
    }

    // Validate admin access
    const adminResult = await getAdminByUserId(data.user.id);

    if (!adminResult.data) {
      return {
        error: new Error("You are not authorized to access this admin panel."),
      };
    }

    // Successful login
    return {
      error: null,
      data: {
        user: data.user,
        session: data.session,
        admin: adminResult.data,
      },
    };
  } catch (e) {
    return { error: new Error("Unexpected login error") };
  }
};

export const signOutService = async () => {
  await supabase.auth.signOut();
};