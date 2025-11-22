type status = "active" | "closed";

export interface Internship {
  id: string;
  company_name: string;
  title: string;
  description: string;
  duration: string;
  status: status;
  created_at: string;
  created_by: string;
}

export interface InternshipWithCount extends Internship {
  application_count: number;
}

export interface InternshipDetailsView {
  id: string;
  title: string;
  company_name: string;
  location?: string ;
  duration: string;
  payment?: string ;              
  job_type?: string ;        
  min_age_required?: string ;  
  description: string;               
  responsibilities?: string[];  
  benefits?: string[];                   
  skills_required?: string[];            
  application_deadline?: string;
}
