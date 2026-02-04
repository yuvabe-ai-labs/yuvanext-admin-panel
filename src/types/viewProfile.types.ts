export type InternshipStatus = "closed" | "active";
export type JobType = "full_time" | "part_time" | "both";

export interface InternshipItem {
    id: string;
    title: string;
    description: string | null;
    duration: string | null;
    payment: string | null;
    status: InternshipStatus;
    closingDate: string;
    isPaid: boolean;
    minAgeRequired: string | null;
    jobType: JobType;
    benefits: string[];
    skillsRequired: string[];
    responsibilities: string[];
    language: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UnitDetail {
    userId: string;
    name: string | null;
    type: string | null;
    phone: string | null;
    address: string | null;
    websiteUrl: string | null;
    mission: string | null;
    values: string | null;
    description: string | null;
    industry: string | null;
    isAurovillian: boolean | null;
    bannerUrl: string | null;
    avatarUrl: string | null;
    galleryImages: string[];
    galleryVideos: string[];
    focusAreas: string[];
    skillsOffered: string[];
    location: string | null;
    opportunitiesOffered: any[];
    projects: any[];
    userAccountStatus: boolean;
    socialLinks: Record<string, string> | null;
    email: string | null;
    internships: InternshipItem[];
    createdAt: string;
    updatedAt: string;
}

export type CandidateType = "student" | "professional" | "other";

export type MaritalStatus =
    | "single"
    | "married"
    | "divorced"
    | "widowed";

export type Gender = "male" | "female" | "other";

export interface LanguageSkill {
    id?: string;
    name: string;
    read?: boolean;
    speak?: boolean;
    write?: boolean;
}

export interface CandidateProfile {
    userId: string;
    email: string | null;
    name: string | null;
    type: CandidateType;
    experienceLevel: string | null;
    profileSummary: string | null;
    location: string | null;
    maritalStatus: MaritalStatus | null;
    isDifferentlyAbled: boolean | null;
    hasCareerBreak: boolean | null;
    createdAt: string;
    updatedAt: string | null;
    skills: string[];
    interests: string[];
    lookingFor: string[];
    avatarUrl: string | null;
    phone: string | null;
    gender: Gender | null;
    dateOfBirth: string | null;
    onboardingCompleted: boolean;
    userAccountStatus: boolean;
    education: unknown[];
    language: LanguageSkill[];
    course: unknown[];
    internship: unknown[];
    projects: unknown[];
    socialLinks: unknown | null;
    internshipName: string;
}
