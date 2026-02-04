import { useQuery } from "@tanstack/react-query";
import {
    getAdminStatsOverview,
    getSignupPerformanceData,
} from "@/services/stats.service";

export const useAdminStatsOverview = () => {
    return useQuery({
        queryKey: ["admin-stats-overview"],
        queryFn: getAdminStatsOverview,
    });
};

export const useSignupPerformanceData = () => {
    return useQuery({
        queryKey: ["signup-performance-data"],
        queryFn: getSignupPerformanceData,
    });
};
