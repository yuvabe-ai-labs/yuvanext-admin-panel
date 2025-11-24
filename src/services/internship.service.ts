// internship.service.ts
import { supabase } from "@/integrations/supabase/client";
import type {
  InternshipWithCount,
  Unit,
  InternshipCreateInput,
  Internship,
} from "@/types/internship.types";

const ITEMS_PER_PAGE = 9;

export const getAllInternships = async (
  page: number = 1,
  searchQuery: string = ""
) => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("internships")
    .select(
      `
      *,
      applications:applications(count)
    `,
      { count: "exact" }
    )
    .eq("status", "active");

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const formatted = data?.map((item) => ({
    ...item,
    application_count: item.applications?.[0]?.count ?? 0,
  }));

  return {
    data: (formatted as InternshipWithCount[]) ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    error,
  };
  };
};

export const getActiveJobCount = async () => {
  const { count, error } = await supabase
    .from("internships")
    .select("*", { count: "exact", head: true })
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  return {
    activeJobs: count ?? 0,
    error,
  };
};

export const getTotalApplications = async () => {
  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true });

  return {
    totalApplications: count ?? 0,
    error,
  };
};

export const suspendInternship = async (internshipId: string) => {
  const { data, error } = await supabase
    .from("internships")
    .update({ status: "closed" })
    .eq("id", internshipId)
    .select()
    .single();

  return {
    data,
    error,
  };
};

export const getInternshipById = async (internshipId: string) => {
  const { data, error } = await supabase
    .from("internships")
    .select("*")
    .eq("id", internshipId)
    .single();

  return {
    data,
    error,
  };
};

export const getUnits = async (): Promise<{ data: Unit[]; error: any }> => {
  const { data, error } = await supabase
    .from("units")
    .select(`
      id,
      profile_id,
      unit_name,
      contact_email
    `)
    .order("unit_name", { ascending: true });

  return { data: data ?? [], error };
};

// Updated: use new type InternshipCreateInput here, keeps original Internship separate
export const createInternshipForUnit = async (internship: InternshipCreateInput) => {
  const { data, error } = await supabase
    .from("internships")
    .insert({
      title: internship.title,
      company_name: internship.company_name,
      duration: internship.duration,
      payment: internship.payment ?? null,
      job_type: internship.job_type ?? null,
      min_age_required: internship.min_age_required ?? null,
      description: internship.description,
      responsibilities: internship.responsibilities ?? [],
      benefits: internship.benefits ?? [],
      skills_required: internship.skills_required ?? [],
      application_deadline: internship.application_deadline ?? null,
      created_by: internship.created_by,
      status: internship.status ?? "draft",
      posted_date: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
};


export const getUnitApplicationCount = async (unitProfileId: string) => {
  const { data, error } = await supabase
    .from("internships")
    .select(
      `
      id,
      applications(count)
    `
    )
    .eq("created_by", unitProfileId); // the unit's profile id

  if (error) return { error, totalApplications: 0 };

  // Sum all application counts
  const totalApplications = data.reduce((sum, internship) => {
    return sum + (internship.applications?.[0]?.count ?? 0);
  }, 0);

  return {
    totalApplications,
    error: null,
  };
};
