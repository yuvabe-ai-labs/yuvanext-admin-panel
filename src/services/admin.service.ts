import { supabase } from "@/integrations/supabase/client";
import type { Admin } from "@/types/users.type";

export const getAdminByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      data: (data as Admin) ?? null,
      error,
    };
  } catch (error: any) {
    return { data: null, error };
  }
};
