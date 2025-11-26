import { supabase } from "@/integrations/supabase/client";
import type { CandidateProfile, CandidateDetailedProfile, HiredCandidateProfile, SuspendCandidateInput } from "@/types/candidate.types";

const ITEMS_PER_PAGE = 9;

export const getAllCandidates = async (
  page: number = 1,
  searchQuery: string = ""
) => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("applications")
    .select(
      `
      id,
      status,
      applied_date,
      internship:internships (
        title,
        company_name
      ),
      profile:profiles!inner (
        full_name,
        student_profile:student_profiles (
          bio,
          skills,
          avatar_url
        )
      )
    `,
      { count: "exact" }
    );

  // Add search filter if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== "") {
    query = query.ilike("profiles.full_name", `%${searchQuery}%`);
  }

  const { data, error, count } = await query
    .order("applied_date", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching candidates:", error);
    return { data: [], totalCount: 0, totalPages: 0, error };
  }

  const formatted: CandidateProfile[] =
    data?.map((item) => {
      const rawSkills = item.profile?.student_profile?.skills;

      return {
        id: item.id,
        name: item.profile?.full_name ?? "",
        internship_title: item.internship?.title ?? "",
        company_name: item.internship?.company_name ?? "",
        status: item.status,
        bio: item.profile?.student_profile?.bio ?? null,
        skills: Array.isArray(rawSkills) ? rawSkills : [],
        avatar_url: item.profile?.student_profile?.avatar_url ?? null,
      };
    }) ?? [];

  return {
    data: formatted,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    error: null,
  };
};

export const getHiredCandidates = async (
  page: number = 1,
  searchQuery: string = ""
) => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("applications")
    .select(
      `
      id,
      status,
      applied_date,
      internship:internships (
        title,
        duration,
        job_type,
        created_by,
        unit_profile:profiles!internships_created_by_fkey (
          unit:units (
            unit_name,
            avatar_url
          )
        )
      ),
      profile:profiles!inner (
        full_name,
        student_profile:student_profiles (
          avatar_url
        )
      )
    `,
      { count: "exact" }
    )
    .eq("status", "hired");

  // Add search filter if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== "") {
    query = query.ilike("profiles.full_name", `%${searchQuery}%`);
  }

  const { data, error, count } = await query
    .order("applied_date", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching hired candidates:", error);
    return { data: [], totalCount: 0, totalPages: 0, error };
  }

  const formatted: HiredCandidateProfile[] =
    data?.map((item) => {
      return {
        id: item.id,
        name: item.profile?.full_name ?? "",
        avatar_url: item.profile?.student_profile?.avatar_url ?? null,
        internship_title: item.internship?.title ?? "",
        status: item.status,
        job_type: item.internship?.job_type ?? null,
        duration: item.internship?.duration ?? null,
        unit_name: item.internship?.unit_profile?.unit?.unit_name ?? null,
        unit_avatar_url: item.internship?.unit_profile?.unit?.avatar_url ?? null,
      };
    }) ?? [];

  return {
    data: formatted,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    error: null,
  };
};

export const getCandidateStats = async () => {
  const { data, error } = await supabase
    .from("applications")
    .select("status");

  if (error) {
    console.error("Error fetching candidate stats:", error);
    return {
      totalCount: 0,
      hiredCount: 0,
      interviewedCount: 0,
      shortlistedCount: 0,
      error,
    };
  }

  const totalCount = data?.length ?? 0;
  const hiredCount = data?.filter((app) => app.status === "hired").length ?? 0;
  const interviewedCount = data?.filter((app) => app.status === "interviewed").length ?? 0;
  const shortlistedCount = data?.filter((app) => app.status === "shortlisted").length ?? 0;

  return {
    totalCount,
    hiredCount,
    interviewedCount,
    shortlistedCount,
    error: null,
  };
};

export const getCandidateDetailedProfile = async (applicationId: string) => {
  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      cover_letter,
      internship:internships ( title ),
      profile:profiles (
        id,
        full_name,
        phone,
        email,
        is_suspended,
        student_profile:student_profiles (
          education,
          projects,
          avatar_url,
          skills,
          interests,
          internships,
          links,
          completed_courses
        )
      )
    `
    )
    .eq("id", applicationId)
    .single();

  if (error) {
    console.error("Error fetching detailed profile:", error);
    return { data: null, error };
  }

  const sp = data.profile?.student_profile;

  const formatted: CandidateDetailedProfile = {
    id: data.id,
    profile_id: data.profile?.id ?? "", // Added profile_id extraction
    internship_title: data.internship?.title ?? "",
    full_name: data.profile?.full_name ?? "",
    phone: data.profile?.phone ?? "",
    email: data.profile?.email ?? "",
    is_suspended: data.profile?.is_suspended ?? false,
    education: Array.isArray(sp?.education) ? sp.education : [],
    projects: Array.isArray(sp?.projects) ? sp.projects : [],
    skills: Array.isArray(sp?.skills) ? sp.skills : [],
    interests: Array.isArray(sp?.interests) ? sp.interests : [],
    internships: Array.isArray(sp?.internships) ? sp.internships : [],
    links: Array.isArray(sp?.links) ? sp.links : [],
    completed_courses: Array.isArray(sp?.completed_courses)
      ? sp.completed_courses
      : [],

    avatar_url: sp?.avatar_url ?? null,
    cover_letter: data.cover_letter ?? null,
  };

  return { data: formatted, error: null };
};

export const suspendCandidate = async ({ profileId }: SuspendCandidateInput) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_suspended: true })
    .eq("id", profileId)
    .select()
    .single();

  return { data, error };
};

export const retrieveCandidate = async ({ profileId }: SuspendCandidateInput) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_suspended: false })
    .eq("id", profileId)
    .select()
    .single();

  return { data, error };
};
