import axiosInstance from "@/config/platform-api";
import type {
    CandidateApplication,
    RecentCandidates,
    RecentUnits,
    Units,
} from "@/types/recentUsers.types";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

export const getRecentCandidates = async (
    page: number,
    limit: number,
): Promise<RecentCandidates[]> => {
    try {
        const response = await axiosInstance.get("/admin/candidates", {
            params: {
                filter: "recent",
                page,
                limit,
            },
        });

        return handleApiResponse<RecentCandidates[]>(response, []);
    } catch (error) {
        return handleApiError(error, "Failed to fetch recent candidates");
    }
};

export const getRecentUnits = async (
    page: number,
    limit: number,
): Promise<RecentUnits[]> => {
    try {
        const response = await axiosInstance.get("/admin/units", {
            params: {
                filter: "recent",
                page,
                limit,
            },
        });

        return handleApiResponse<RecentUnits[]>(response, []);
    } catch (error) {
        return handleApiError(error, "Failed to fetch recent units");
    }
};

export const getAppliedCandidates = async (
    page: number,
    limit: number,
): Promise<CandidateApplication[]> => {
    try {
        const response = await axiosInstance.get("/admin/applications", {
            params: {
                filter: "recent",
                page,
                limit,
            },
        });

        return handleApiResponse<CandidateApplication[]>(response, []);
    } catch (error) {
        return handleApiError(error, "Failed to fetch applied candidates");
    }
};

export const getUnits = async (
    page: number,
    limit: number,
): Promise<Units[]> => {
    try {
        const response = await axiosInstance.get("/admin/units", {
            params: {
                filter: "active",
                page,
                limit,
            },
        });

        return handleApiResponse<Units[]>(response, []);
    } catch (error) {
        return handleApiError(error, "Failed to fetch units");
    }
};
