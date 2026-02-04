import axiosInstance from "@/config/platform-api";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";
import type { ApplicationTasks } from "@/types/candidateTasks.types";

export const getTasksByApplicationId = async (
    applicationId: string,
): Promise<ApplicationTasks> => {
    try {
        const response = await axiosInstance.get(
            `/tasks/application/${applicationId}`,
        );

        return handleApiResponse<ApplicationTasks>(
            response,
            {} as ApplicationTasks,
        );
    } catch (error) {
        return handleApiError(error, "Failed to fetch tasks");
    }
};
