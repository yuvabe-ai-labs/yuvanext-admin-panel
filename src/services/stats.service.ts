import axiosInstance from "@/config/platform-api";
import type {
    AdminStatsOverview,
    SignupPerformanceData,
} from "@/types/stats.types";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

// Fetch admin dashboard overview stats
export const getAdminStatsOverview = async (): Promise<AdminStatsOverview> => {
    try {
        const response = await axiosInstance.get(
            "/admin/stats/overview",
        );

        return handleApiResponse<AdminStatsOverview>(
            response,
            {} as AdminStatsOverview,
        );
    } catch (error) {
        return handleApiError(error, "Failed to fetch admin stats overview");
    }
};

export const getSignupPerformanceData = async (): Promise<
    SignupPerformanceData[]
> => {
    try {
        const response = await axiosInstance.get(
            "/admin/all",
        );

        return handleApiResponse<SignupPerformanceData[]>(
            response,
            [],
        );
    } catch (error) {
        return handleApiError(error, "Failed to fetch admin stats overview");
    }
};
