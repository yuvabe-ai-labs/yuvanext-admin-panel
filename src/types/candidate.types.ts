import type { Json } from "@/integrations/supabase/types";

export interface CandidateProfile {
  id: string;
  name: string;
  internship_title: string;
  status: string;
  bio: any[] | null;
  skills: any[] | null;
  avatar_url: string | null;
}

export interface HiredCandidateProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  internship_title: string;
  status: string;
  job_type: string | null;
  duration: string | null;
  unit_name: string | null;
  unit_avatar_url: string | null;
}

export interface CandidateDetailedProfile {
  id: string;
  profile_id: string; // Added profile_id
  full_name: string;
  phone: string | null;
  email: string | null;

  internship_title: string;

  education: Json[];
  projects: Json[];
  skills: Json[];
  interests: Json[];
  internships: Json[];
  links: Json[];
  completed_courses: Json[];
  avatar_url: string | null;
  cover_letter: string | null;
}

export interface SuspendCandidateInput {
  profileId: string;  
}