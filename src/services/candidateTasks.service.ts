import axiosInstance from "@/config/platform-api";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";
import type { ApplicationTaskDetails } from "@/types/candidateTasks.types";

export const getTasksByApplicationId = async (
    applicationId: string,
): Promise<ApplicationTaskDetails> => {
    try {
        const response = await axiosInstance.get(
            `/tasks/application/${applicationId}`,
        );

        return handleApiResponse<ApplicationTaskDetails>(
            response,
            {} as ApplicationTaskDetails,
        );
    } catch (error) {
        return handleApiError(error, "Failed to fetch tasks");
    }
};
