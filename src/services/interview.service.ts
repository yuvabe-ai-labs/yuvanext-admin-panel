import { supabase } from "@/integrations/supabase/client";
import type { ScheduledInterview, ScheduledInterviewsResponse } from "@/types/interview.types";

const ITEMS_PER_PAGE = 9;

export const getScheduledInterviews = async (
  page: number = 1,
  searchQuery: string = ""
): Promise<ScheduledInterviewsResponse> => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("interviews")
    .select(
      `
      id,
      application_id,
      scheduled_date,
      duration_minutes,
      meeting_link,
      title,
      description,
      status,
      created_at,

      student:profiles!interviews_receiver_id_fkey (
        full_name,
        student_profile:student_profiles (
          avatar_url
        )
      ),

      application:applications (
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
        )
      )
    `,
      { count: "exact" }
    )
    .eq("status", "scheduled");

  if (searchQuery && searchQuery.trim() !== "") {
    query = query.ilike("student.full_name", `%${searchQuery}%`);
  }

  const { data, error, count } = await query
    .order("scheduled_date", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching scheduled interviews:", error);
    return { data: [], totalCount: 0, totalPages: 0, error };
  }

  const formatted: ScheduledInterview[] =
    data?.map((item: any) => {
      return {
        id: item.id,
        application_id: item.application_id,
        scheduled_date: item.scheduled_date,
        duration_minutes: item.duration_minutes ?? 60,
        meeting_link: item.meeting_link,
        title: item.title,
        description: item.description,
        status: item.status,
        created_at: item.created_at,

        student_name: item.student?.full_name ?? "",
        student_avatar_url: item.student?.student_profile?.avatar_url ?? null,

        internship_title: item.application?.internship?.title ?? "",
        unit_name: item.application?.internship?.unit_profile?.unit?.unit_name ?? null,
        unit_avatar_url: item.application?.internship?.unit_profile?.unit?.avatar_url ?? null,

        job_type: item.application?.internship?.job_type ?? null,
        duration: item.application?.internship?.duration ?? null,
      };
    }) ?? [];

  return {
    data: formatted,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    error: null,
  };
};

export const getInterviewStats = async () => {
  const { data, error } = await supabase
    .from("interviews")
    .select("status");

  if (error) {
    console.error("Error fetching interview stats:", error);
    return {
      totalScheduled: 0,
      totalCompleted: 0,
      totalCancelled: 0,
      totalNoShow: 0,
      error,
    };
  }

  const totalScheduled = data?.filter((interview) => interview.status === "scheduled").length ?? 0;
  const totalCompleted = data?.filter((interview) => interview.status === "completed").length ?? 0;
  const totalCancelled = data?.filter((interview) => interview.status === "cancelled").length ?? 0;
  const totalNoShow = data?.filter((interview) => interview.status === "no_show").length ?? 0;

  return {
    totalScheduled,
    totalCompleted,
    totalCancelled,
    totalNoShow,
    error: null,
  };
};

export const cancelInterview = async (interviewId: string) => {
  const { data, error } = await supabase
    .from("interviews")
    .update({ 
      status: "cancelled",
      updated_at: new Date().toISOString()
    })
    .eq("id", interviewId)
    .select()
    .single();

  return { data, error };
};