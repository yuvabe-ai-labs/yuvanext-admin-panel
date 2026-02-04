import axiosInstance from "@/config/platform-api";
import type {
    AppliedCandidates,
    AppliedCandidatesResponse,
    GetApplicationParams,
    HiredCandidate,
    HiredCandidateResponse,
    InterviewDetails,
    InterviewScheduleResponse,
} from "@/types/applications.types";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

const DEFAULT_PAGINATION = (limit: number) => ({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
});

export const getAppliedCandidates = async (
    params: GetApplicationParams = {},
): Promise<AppliedCandidatesResponse> => {
    try {
        const limit = params.limit || 12;
        const response = await axiosInstance.get("/admin/candidates", {
            params: {
                filter: "applied",
                page: params.page || 1,
                limit,
                search: params.search,
            },
        });
        // handleApiResponse extracts response.data.data (the array)
        const data = handleApiResponse<AppliedCandidates[]>(response, []);
        return {
            data,
            pagination: response.data.pagination || DEFAULT_PAGINATION(limit),
        };
    } catch (error) {
        return handleApiError(error, "Failed to fetch applied candidates");
    }
};

export const getShortlistedCandidates = async (
    params: GetApplicationParams = {},
): Promise<AppliedCandidatesResponse> => {
    try {
        const limit = params.limit || 12;
        const response = await axiosInstance.get("/admin/candidates", {
            params: {
                filter: "shortlisted",
                page: params.page || 1,
                limit,
                search: params.search,
            },
        });
        const data = handleApiResponse<AppliedCandidates[]>(response, []);
        return {
            data,
            pagination: response.data.pagination || DEFAULT_PAGINATION(limit),
        };
    } catch (error) {
        return handleApiError(error, "Failed to fetch shortlisted candidates");
    }
};

export const getHiredCandidates = async (
    params: GetApplicationParams = {},
): Promise<HiredCandidateResponse> => {
    try {
        const limit = params.limit || 10;
        const response = await axiosInstance.get("/admin/candidates", {
            params: {
                filter: "hired",
                page: params.page || 1,
                limit,
                search: params.search,
            },
        });
        const data = handleApiResponse<HiredCandidate[]>(response, []);
        return {
            data,
            pagination: response.data.pagination || DEFAULT_PAGINATION(limit),
        };
    } catch (error) {
        return handleApiError(error, "Failed to fetch hired candidates");
    }
};

export const getInterviewSchedule = async (
    params: GetApplicationParams = {},
): Promise<InterviewScheduleResponse> => {
    try {
        const limit = params.limit || 10;
        const response = await axiosInstance.get("/admin/applications", {
            params: {
                filter: "interview",
                page: params.page || 1,
                limit,
                search: params.search,
            },
        });
        const data = handleApiResponse<InterviewDetails[]>(response, []);
        return {
            data,
            pagination: response.data.pagination || DEFAULT_PAGINATION(limit),
        };
    } catch (error) {
        return handleApiError(error, "Failed to fetch interview schedule");
    }
};
