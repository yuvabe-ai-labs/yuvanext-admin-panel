import { supabase } from "@/integrations/supabase/client";
import type { SignInResponse } from "@/types/auth.type";
import { getAdminByUserId } from "./admin.service";
import { Unauthorized } from "@/errors/AppError";

export const signInService = async (
  email: string,
  password: string
): Promise<SignInResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: new Unauthorized(error.message, 401, "AUTH_FAILED") };
    }

    if (!data.user || !data.session) {
      return { error: new Unauthorized("Invalid login response", 400) };
    }

    const adminResult = await getAdminByUserId(data.user.id);

    if (!adminResult.data) {
      return {
        error: new Unauthorized(
          "You are not authorized to access this admin panel.",
          403,
          "UNAUTHORIZED_ADMIN"
        ),
      };
    }

    return {
      error: null,
      data: {
        user: data.user,
        session: data.session,
        admin: adminResult.data,
      },
    };
  } catch (err) {
    return { error: new Unauthorized("Unexpected login error", 500) };
  }
};

export const signOutService = async () => {
  await supabase.auth.signOut();
};