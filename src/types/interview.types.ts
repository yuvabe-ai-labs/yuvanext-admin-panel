export interface ScheduledInterview {
  id: string;
  application_id: string;
  scheduled_date: string;
  duration_minutes: number;
  meeting_link: string;
  title: string | null;
  description: string | null;
  status: 'scheduled';
  created_at: string;
  student_name: string;
  student_avatar_url: string | null;
  internship_title: string;
  unit_name: string | null;
  unit_avatar_url: string | null;
  job_type?: string | null;
  duration?: string | null;
}

export interface ScheduledInterviewsResponse {
  data: ScheduledInterview[];
  totalCount: number;
  totalPages: number;
  error: any;
}