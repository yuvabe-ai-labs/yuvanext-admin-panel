export interface AdminStatsOverview {
    totalUnits: number;
    newUnitsThisMonth: string;
    totalCandidates: number;
    newCandidatesThisMonth: string;
    totalActiveInternships: number;
    newInternshipsThisMonth: string;
    totalCourses: number;
    newCoursesThisMonth: string;
    totalHiredCandidates: number;
    newHiresThisMonth: string;
    healthPercentage: number;
}

export interface SignupPerformanceData {
    id: string;
    name: string | null;
    createdAt: string;
    type: "candidate" | "unit";
}
