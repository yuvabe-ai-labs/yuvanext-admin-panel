import { supabase } from "@/integrations/supabase/client";
import type { InternshipWithCount } from "@/types/internship.types";

const ITEMS_PER_PAGE = 9;

export const getAllInternships = async (page: number = 1, searchQuery: string = "") => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("internships")
    .select(`
      *,
      applications:applications(count)
    `, { count: "exact" })
    .eq("status", "active");

  // Add search filter if searchQuery exists
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

export const getActiveJobCount = async () => {
  const { count, error } = await supabase
    .from("internships")
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