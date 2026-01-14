import type { JobType } from "./viewProfile.types";

export type InternshipApplicationStatus =
  | "applied"
  | "shortlisted"
  | "not_shortlisted"
  | "interviewed"
  | "hired";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Standard parameter object for hooks and services
export interface GetApplicationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AppliedCandidates {
  candidateId: string;
  avatarUrl: string | null;
  name: string;
  internshipName: string;
  applicationStatus: InternshipApplicationStatus;
  applicationId: string;
  applicationCreatedAt: string;
  skills: string[];
  interests: string[];
  profileSummary: string | null;
}

export interface AppliedCandidatesResponse {
  data: AppliedCandidates[];
  pagination: PaginationMeta;
}

export interface HiredCandidate {
  candidateId: string;
  avatarUrl: string | null;
  name: string;
  internshipName: string;
  applicationStatus: InternshipApplicationStatus;
  unitAvatarUrl: string | null;
  unitName: string;
  internshipDuration: string;
  internshipJobType: JobType;
  applicationId: string;
  applicationCreatedAt: string;
  hasTask: boolean;
}

export interface HiredCandidateResponse {
  data: HiredCandidate[];
  pagination: PaginationMeta;
}

export interface InterviewDetails {
  candidateId: string;
  name: string;
  avatarUrl: string;
  profileSummary: string;
  internshipDuration: string;
  internshipJobType: JobType;
  unitId: string;
  unitAvatarUrl: string;
  applicationId: string;
  interviewDate: string;
}

export interface InterviewScheduleResponse {
  data: InterviewDetails[];
  pagination: PaginationMeta;
}
