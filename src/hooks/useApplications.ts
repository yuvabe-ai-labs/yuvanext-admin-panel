import { useQuery } from "@tanstack/react-query";
import {
    getAppliedCandidates,
    getHiredCandidates,
    getInterviewSchedule,
    getShortlistedCandidates,
} from "@/services/applications.service";

import type {
    AppliedCandidatesResponse,
    GetApplicationParams,
    HiredCandidateResponse,
    InterviewScheduleResponse,
} from "@/types/applications.types";

export const useAppliedCandidates = (params: GetApplicationParams = {}) => {
    return useQuery<AppliedCandidatesResponse>({
        queryKey: ["admin-candidates", "applied", params],
        queryFn: () => getAppliedCandidates(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useShortlistedCandidates = (params: GetApplicationParams = {}) => {
    return useQuery<AppliedCandidatesResponse>({
        queryKey: ["admin-candidates", "shortlisted", params],
        queryFn: () => getShortlistedCandidates(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useHiredCandidates = (params: GetApplicationParams = {}) => {
    return useQuery<HiredCandidateResponse>({
        queryKey: ["admin-candidates", "hired", params],
        queryFn: () => getHiredCandidates(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useInterviewSchedule = (params: GetApplicationParams = {}) => {
    return useQuery<InterviewScheduleResponse>({
        queryKey: ["admin-applications", "interview", params],
        queryFn: () => getInterviewSchedule(params),
        placeholderData: (previousData) => previousData,
    });
};
