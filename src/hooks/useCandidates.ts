import { useQuery } from "@tanstack/react-query";
import { getAllCandidates, getCandidateStats, getCandidateDetailedProfile, getHiredCandidates } from "@/services/candidate.service";

export const useCandidates = (page: number = 1, searchQuery: string = "") => {
  return useQuery({
    queryKey: ["candidates", page, searchQuery],
    queryFn: () => getAllCandidates(page, searchQuery),
  });
};

export const useHiredCandidates = (page: number = 1, searchQuery: string = "") => {
  return useQuery({
    queryKey: ["hiredCandidates", page, searchQuery],
    queryFn: () => getHiredCandidates(page, searchQuery),
  });
};

export const useCandidateStats = () => {
  return useQuery({
    queryKey: ["candidateStats"],
    queryFn: getCandidateStats,
  });
};

export const useCandidateDetailedProfile = (applicationId: string) => {
  return useQuery({
    queryKey: ["candidateDetailedProfile", applicationId],
    queryFn: () => getCandidateDetailedProfile(applicationId),
    enabled: !!applicationId,
  });
};