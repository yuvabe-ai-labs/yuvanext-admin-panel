import type { Json } from "@/types/common";

type UserRole = "student" | "unit";

type ProfileType = "Student" | "Fresher" | "Working" | "Graduate";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
}

export interface StudentProfileData {
  profile: Profile;
  student_profile: StudentProfile;
}

export interface UnitProfileData {
  profile: Profile;
  unit_profile: UnitProfile;
}

export interface StudentProfile {
  id: string;
  profile_id: string;
  profile_type: ProfileType
  experience_level: string | null;
  preferred_language: string | null;

  education: Json[];
  projects: Json[];
  languages: Json[];

  created_at: string;
  updated_at: string;

  resume_url: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;

  completed_courses: Json[] | null;

  location: string | null;

  achievements: Json[];
  linkedin_url: string | null;
  behance_url: string | null;
  dribbble_url: string | null;
  website_url: string | null;

  avatar_url: string | null;
  skills: Json[] | null;
  interests: Json[] | null;

  looking_for: string[] | null;
  bio: string[] | null;
  headline: string | null;
  marital_status: string | null;

  is_differently_abled: boolean | null;
  has_career_break: boolean | null;

  banner_url: string | null;

  internships: Json[];
  links: Json[];
}

export interface UnitProfile {
  id: string;
  profile_id: string;

  unit_name: string | null;
  unit_type: string | null;

  focus_areas: Json[];
  skills_offered: Json[];
  opportunities_offered: Json[];

  is_aurovillian: boolean | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;

  created_at: string;
  updated_at: string;

  website_url: string | null;
  mission: string | null;
  values: string | null;
  description: string | null;
  industry: string | null;

  social_links: Json[];
  projects: Json[];

  banner_url: string | null;
  avatar_url: string | null;

  gallery_images: Json[];
  glimpse: Json[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  location?: string | null;
  bio?: string[] | string | null;
  skills?: string[] | null;
  avatar_url?: string | null;
}

export interface Unit {
  profile: {
    id: string;
    full_name: string;
    email: string | null;
    created_at: string;
    onboarding_completed: boolean | null;
    is_suspended?: boolean;
  };
  unit_profile: {
    id: string;
    unit_name: string | null;
    unit_type: string | null;
    avatar_url: string | null;
    address: string | null;
  } | null;
  application_count?: number;        
  active_internships_count?: number; 
}

export interface PerformanceData {
  month: string;
  value: number;
}