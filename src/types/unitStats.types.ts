export interface UnitStats {
    totalRegisteredUnits: number;
    activeUnits: number;
    activeJobPosts: number;
    totalApplications: number;
}

export type CompanyType =
    | "auroville_unit"
    | "non_auroville_unit";

export interface AddCompanyRequest {
    companyName: string;
    companyEmail: string;
    contactNumber: string;
    companyType: CompanyType;
    industryType: string;
    address: string;
    aboutCompany: string;
    serviceOffered: string;
    achievements: string;
    password: string;
}

export interface AddCompanyResponse {
    userId: string;
    email: string;
    name: string;
    message: string;
}
