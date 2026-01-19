export type ProfileType =
    | "student"
    | "fresher"
    | "working"
    | "graduate";

export interface RecentCandidates {
    userId: string;
    name: string | null;
    type: ProfileType;
    location: string | null;
    avatarUrl: string | null;
    createdAt: string;
}

export interface RecentUnits {
    userId: string;
    name: string | null;
    address: string | null;
    avatarUrl: string | null;
}

export type ApplicationStatus =
    | "applied"
    | "interview"
    | "hired"
    | "rejected";

export interface CandidateApplication {
    applicationId: string;
    candidateId: string;
    avatarUrl: string | null;
    name: string | null;
    internshipName: string | null;
    applicationStatus: ApplicationStatus;
    unitName: string | null;
    appliedAt: string;
    skills: string[];
    interests: string[];
    profileSummary: string | null;
}

export interface Units {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    totalApplications: string;
    totalActiveInternships: string;
    internshipCreatedAt: string;
    accountStatus: boolean;
}
