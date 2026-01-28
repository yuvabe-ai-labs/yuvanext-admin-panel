import axiosInstance from "@/config/platform-api";
import type {
    AddCompanyRequest,
    AddCompanyResponse,
    UnitStats,
} from "@/types/unitStats.types";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

// Fetch admin dashboard overview stats
export const getUnitStatsOverview = async (): Promise<UnitStats> => {
    try {
        const response = await axiosInstance.get(
            "/admin/stats/units",
        );

        return handleApiResponse<UnitStats>(response, {
            totalRegisteredUnits: 0,
            activeUnits: 0,
            activeJobPosts: 0,
            totalApplications: 0,
        });
    } catch (error) {
        return handleApiError(error, "Failed to fetch unit stats overview");
    }
};


export const addCompany = async (payload: AddCompanyRequest) => {
    try {
        const response = await axiosInstance.post("/admin/units/add-company", {
            ...payload,
        });
        return handleApiResponse<AddCompanyResponse>(
            response,
            {} as AddCompanyResponse,
        );
    } catch (error) {
        return handleApiError(error, "Failed to add company");
    }
};
