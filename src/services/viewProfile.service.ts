import axiosInstance from "@/config/platform-api";
import type { CandidateProfile, UnitDetail } from "@/types/viewProfile.types";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

// Fetch unit details by unitId
export const getUnitDetail = async (
    unitId: string,
): Promise<UnitDetail> => {
    try {
        const response = await axiosInstance.get(`/units/${unitId}`);
        return handleApiResponse<UnitDetail>(response, {} as UnitDetail);
    } catch (error) {
        return handleApiError(
            error,
            `Failed to fetch unit details for ${unitId}`,
        );
    }
};

export const getCandidateDetail = async (
    applicationId: string,
): Promise<CandidateProfile> => {
    try {
        const response = await axiosInstance.get(
            `/admin/candidates/${applicationId}`,
        );
        return handleApiResponse<CandidateProfile>(
            response,
            {} as CandidateProfile,
        );
    } catch (error) {
        return handleApiError(
            error,
            `Failed to fetch candidate details for ${applicationId}`,
        );
    }
};
