export type status = "active" | "closed";

export interface Unit {
  id: string;
  profile_id: string;
  unit_name: string;
  contact_email?: string;
}

export interface InternshipCreateInput {
  title: string;
  company_name: string;
  duration: string;
  payment?: string;
  job_type?: "part_time" | "full_time" | "both";
  min_age_required?: string;
  description: string;
  responsibilities?: string[];
  benefits?: string[];
  skills_required?: string[];
  application_deadline?: string;
  created_by: string;
  status?: "draft" | "active";
}

export interface Internship {
  id: string;
  company_name: string;
  title: string;
  description: string;
  duration: string;
  status: status;
  created_at: string;
  created_by: string; 
  unit?: Unit; 
}

export interface InternshipWithCount extends Internship {
  application_count: number;
}

export interface InternshipDetailsView {
  id: string;
  title: string;
  company_name: string;
  location?: string;
  duration: string;
  payment?: string;
  job_type?: string;
  min_age_required?: string;
  description: string;
  responsibilities?: string[];
  benefits?: string[];
  skills_required?: string[];
  application_deadline?: string;
}

