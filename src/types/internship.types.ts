export interface CreatedBy {
  userId: string | null;
  name: string | null;
  address: string | null;
  phone: string | null;
  websiteUrl: string | null;
  description: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  location: string | null;
}

// Job / Internship Data
export interface InternshipDetailsView {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  payment: string | null;
  status: "active" | "inactive" | "closed";
  closingDate: string;
  isPaid: boolean;
  minAgeRequired: number | null;
  jobType: "full_time" | "part_time" | "both";
  benefits: string[];
  skillsRequired: string[];
  responsibilities: string[];
  language: string[];
  createdAt: string;
  updatedAt: string;
  applicationCount: number;
  createdBy: CreatedBy;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface Internship {
  internshipId: string;
  name: string;
  createdById: string;
  createdByName: string;
  totalApplications: number;
  duration: string;
  createdAt: string;
  status: "active" | "inactive";
}

export interface PaginatedInternshipData {
  internships: Internship[];
  pagination: Pagination;
}

export interface GetInternshipsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CreateInternshipPayload {
  title: string;
  description: string;
  duration: string;
  payment: string;
  status: "active" | "inactive" | "closed";
  closingDate: string;
  isPaid: boolean;
  minAgeRequired: string | number;
  jobType: "full_time" | "part_time" | "both";
  benefits: string[];
  skillsRequired: string[];
  responsibilities: string[];
  language: string[];
  createdBy: string;
}

export type AISection =
  | "about"
  | "key_responsibilities"
  | "what_you_will_get"
  | "skills_required";

export interface AIGenerateRequest {
  title: string;
  sections: AISection[];
}

export interface AIGenerateResponse {
  status_code: number;
  message: string;
  data: {
    about?: string;
    key_responsibilities?: string[];
    what_you_will_get?: string[];
    skills_required?: string[];
  };
}
