import { useQuery } from "@tanstack/react-query";
import {
    getCandidateDetail,
    getUnitDetail,
} from "@/services/viewProfile.service";

export const useUnitDetail = (unitId?: string) => {
    return useQuery({
        queryKey: ["unit-detail", unitId],
        queryFn: () => getUnitDetail(unitId as string),
        enabled: !!unitId,
    });
};

export const useCandidateDetail = (applicationId?: string) => {
    return useQuery({
        queryKey: ["candidate-detail", applicationId],
        queryFn: () => getCandidateDetail(applicationId as string),
        enabled: !!applicationId,
    });
};
