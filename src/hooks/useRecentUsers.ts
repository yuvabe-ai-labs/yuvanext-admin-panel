import { useQuery } from "@tanstack/react-query";
import {
    getAppliedCandidates,
    getRecentCandidates,
    getRecentUnits,
    getUnits,
} from "@/services/recentUsers.service";

export const useRecentCandidates = (
    page: number,
    limit: number,
) => {
    return useQuery({
        queryKey: ["recent-candidates", page, limit],
        queryFn: () => getRecentCandidates(page, limit),
    });
};

export const useRecentUnits = (
    page: number,
    limit: number,
) => {
    return useQuery({
        queryKey: ["recent-units", page, limit],
        queryFn: () => getRecentUnits(page, limit),
    });
};

export const useAppliedCandidates = (
    page: number,
    limit: number,
) => {
    return useQuery({
        queryKey: ["applied-candidates", page, limit],
        queryFn: () => getAppliedCandidates(page, limit),
    });
};

export const useUnits = (
    page: number,
    limit: number,
) => {
    return useQuery({
        queryKey: ["units", page, limit],
        queryFn: () => getUnits(page, limit),
    });
};
