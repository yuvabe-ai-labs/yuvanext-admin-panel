export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: "student" | "unit";
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
  profile_type: "Student" | "Fresher" | "Working" | "Graduate" | null;
  experience_level: string | null;
  preferred_language: string | null;
  education: any[]; // jsonb
  projects: any[];
  languages: any[];
  created_at: string;
  updated_at: string;

  resume_url: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;
  completed_courses: any[] | null;
  location: string | null;
  achievements: any[];
  linkedin_url: string | null;
  behance_url: string | null;
  dribbble_url: string | null;
  website_url: string | null;

  avatar_url: string | null;
  skills: any[] | null;
  interests: any[] | null;
  looking_for: string[] | null;
  bio: string[] | null;
  headline: string | null;
  marital_status: string | null;

  is_differently_abled: boolean | null;
  has_career_break: boolean | null;

  banner_url: string | null;
  internships: any[];
  links: any[];
}

export interface UnitProfile {
  id: string;
  profile_id: string;

  unit_name: string | null;
  unit_type: string | null;

  focus_areas: any[];
  skills_offered: any[];
  opportunities_offered: any[];

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

  social_links: any[];
  projects: any[];

  banner_url: string | null;
  avatar_url: string | null;

  gallery_images: any[];
  glimpse: any[];
}

