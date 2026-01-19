import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCompany, getUnitStatsOverview } from "@/services/unitStats.service";
import type {
    AddCompanyRequest,
    AddCompanyResponse,
} from "@/types/unitStats.types";

export const useUnitStatsOverview = () => {
    return useQuery({
        queryKey: ["unit-stats-overview"],
        queryFn: getUnitStatsOverview,
    });
};

export const useAddCompany = () => {
    const queryClient = useQueryClient();

    return useMutation<AddCompanyResponse, Error, AddCompanyRequest>({
        mutationFn: addCompany,

        onSuccess: () => {
            // Refetch units list after adding company
            queryClient.invalidateQueries({
                queryKey: ["units"],
            });

            // Optional: refetch unit stats
            queryClient.invalidateQueries({
                queryKey: ["unit-stats"],
            });
        },
    });
};
