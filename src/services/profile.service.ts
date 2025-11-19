import { supabase } from "@/integrations/supabase/client";
import type {
  Profile,
  StudentProfile,
  UnitProfile,
  StudentProfileData,
  UnitProfileData,
} from "@/types/profile.types";

// Get all profiles (common function)
export const getAllProfiles = async (
  page: number = 1,
  pageSize: number = 20,
  role?: "student" | "unit",
  searchTerm?: string
) => {
  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (role) query = query.eq("role", role);

  if (searchTerm) {
    query = query.or(
      `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  return {
    data: (data as Profile[]) ?? [],
    error,
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  };
};

// Get profile by ID (returns StudentProfileData | UnitProfileData)
export const getProfileDetailsById = async (
  profileId: string
): Promise<{ data: StudentProfileData | UnitProfileData | null; error: any }> => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (profileError || !profile) {
    return { data: null, error: profileError };
  }

  // STUDENT PROFILE
  if (profile.role === "student") {
    const { data: studentProfile, error: studentError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    return {
      data: {
        profile: profile as Profile,
        student_profile: studentProfile as StudentProfile,
      },
      error: studentError,
    };
  }

  // UNIT PROFILE
  if (profile.role === "unit") {
    const { data: unitProfile, error: unitError } = await supabase
      .from("units")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    return {
      data: {
        profile: profile as Profile,
        unit_profile: unitProfile as UnitProfile,
      },
      error: unitError,
    };
  }

  return { data: null, error: null };
};

// Get all students (returns StudentProfileData[])
export const getAllStudents = async (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string
) => {
  const profilesRes = await getAllProfiles(page, pageSize, "student", searchTerm);

  if (profilesRes.error) {
    return { ...profilesRes, data: [] as StudentProfileData[] };
  }

  const profileIds = profilesRes.data.map((p) => p.id);

  const { data: studentProfiles } = await supabase
    .from("student_profiles")
    .select("*")
    .in("profile_id", profileIds);

  const combined: StudentProfileData[] = profilesRes.data.map((profile) => ({
    profile,
    student_profile: studentProfiles?.find(
      (sp) => sp.profile_id === profile.id
    ) as StudentProfile,
  }));

  return {
    data: combined,
    error: null,
    count: profilesRes.count,
    totalPages: profilesRes.totalPages,
  };
};

// Get all units 
export const getAllUnits = async (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string
) => {
  const profilesRes = await getAllProfiles(page, pageSize, "unit", searchTerm);

  if (profilesRes.error) {
    return { ...profilesRes, data: [] as UnitProfileData[] };
  }

  const profileIds = profilesRes.data.map((p) => p.id);

  const { data: unitProfiles } = await supabase
    .from("units")
    .select("*")
    .in("profile_id", profileIds);

  const combined: UnitProfileData[] = profilesRes.data.map((profile) => ({
    profile,
    unit_profile: unitProfiles?.find(
      (up) => up.profile_id === profile.id
    ) as UnitProfile,
  }));

  return {
    data: combined,
    error: null,
    count: profilesRes.count,
    totalPages: profilesRes.totalPages,
  };
};

// Get profile statistics
export const getProfileStats = async () => {
  const { count: totalProfiles } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  const { count: totalUnits } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "unit");

  const { count: completedOnboarding } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("onboarding_completed", true);

  return {
    totalProfiles: totalProfiles ?? 0,
    totalStudents: totalStudents ?? 0,
    totalUnits: totalUnits ?? 0,
    completedOnboarding: completedOnboarding ?? 0,
  };
};
