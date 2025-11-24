import { supabase } from "@/integrations/supabase/client";
import type {
  Profile,
  StudentProfile,
  UnitProfile,
  StudentProfileData,
  UnitProfileData,
} from "@/types/profile.types";

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

  if (searchTerm?.trim()) {
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
): Promise<{
  data: StudentProfileData | UnitProfileData | null;
  error: any;
}> => {
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

// Get all students
export const getAllStudents = async (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string
) => {
  const profilesRes = await getAllProfiles(
    page,
    pageSize,
    "student",
    searchTerm
  );

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

// Get all units with application count & active internships count
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

  // Fetch unit profiles
  const { data: unitProfiles } = await supabase
    .from("units")
    .select("*")
    .in("profile_id", profileIds);

  // Fetch internships for these units
  const { data: internships } = await supabase
    .from("internships")
    .select("id, created_by, status")
    .in("created_by", profileIds);

  // Count active internships per unit
  const activeInternshipsCountMap: Record<string, number> = {};
  internships?.forEach((i) => {
    if (!activeInternshipsCountMap[i.created_by]) activeInternshipsCountMap[i.created_by] = 0;
    if (i.status === "active") activeInternshipsCountMap[i.created_by] += 1;
  });

  // Fetch applications for these internships
  const internshipIds = internships?.map((i) => i.id) || [];
  const { data: applications } = await supabase
    .from("applications")
    .select("internship_id")
    .in("internship_id", internshipIds);

  // Count applications per unit
  const applicationsCountMap: Record<string, number> = {};
  applications?.forEach((app) => {
    const internship = internships?.find((i) => i.id === app.internship_id);
    if (!internship) return;
    if (!applicationsCountMap[internship.created_by]) applicationsCountMap[internship.created_by] = 0;
    applicationsCountMap[internship.created_by] += 1;
  });

  // Combine data
  const combined: UnitProfileData[] = profilesRes.data.map((profile) => {
    const unitProfile = unitProfiles?.find((up) => up.profile_id === profile.id);
    return {
      profile,
      unit_profile: unitProfile as UnitProfile,
      active_internships_count: activeInternshipsCountMap[profile.id] || 0,
      application_count: applicationsCountMap[profile.id] || 0,
    };
  });

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

  const { count: activeUnits } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "unit")
    .eq("onboarding_completed", true);

  const { count: registeredUnits } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "unit")
    .eq("onboarding_completed", false);

  return {
    totalProfiles: totalProfiles ?? 0,
    totalStudents: totalStudents ?? 0,
    totalUnits: totalUnits ?? 0,
    completedOnboarding: completedOnboarding ?? 0,
    activeUnits: activeUnits ?? 0,
    registeredUnits: registeredUnits ?? 0,
  };
};

// Total active internships
export const getActiveInternships = async () => {
  // 👉 1) Get total active internships
  const { count: totalInternships } = await supabase
    .from("internships")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 👉 2) Start of current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // 👉 3) Count active internships created this month
  const { count: internshipsThisMonth, error } = await supabase
    .from("internships")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")         // ✅ filter ACTIVE only
    .gte("created_at", startOfMonth);

  if (error) {
    console.error("Error fetching internshipsThisMonth:", error);
  }

  return {
    totalInternships: totalInternships ?? 0,
    internshipsThisMonth: internshipsThisMonth ?? 0,
  };
};

export const getActiveCourses = async () => {
  // 👉 1) Get total active courses
  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 👉 2) Calculate start of current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // 👉 3) Count courses created this month
  const { count: coursesThisMonth, error } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth);

  if (error) {
    console.error("Error fetching coursesThisMonth:", error);
  }

  return {
    totalCourses: totalCourses ?? 0,
    coursesThisMonth: coursesThisMonth ?? 0,
  };
};

export const getHiredStats = async () => {
  // 👉 1) Total hired applications
  const { count: totalHired } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "hired");

  // 👉 2) Start of current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // 👉 3) Hired this month
  const { count: hiredThisMonth, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "hired")
    .gte("applied_date", startOfMonth);

  if (error) {
    console.error("Error fetching hiredThisMonth:", error);
  }

  return {
    totalHired: totalHired ?? 0,
    hiredThisMonth: hiredThisMonth ?? 0,
  };
};

// Total applications
export const getTotalApplications = async () => {
  const { count: totalApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true });
  return { totalApplications: totalApplications ?? 0 };
};
