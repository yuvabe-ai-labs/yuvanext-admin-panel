import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCandidates,
  getCandidateStats,
  getCandidateDetailedProfile,
  getHiredCandidates,
  suspendCandidate,
  retrieveCandidate
} from "@/services/candidate.service";
import { toast } from "sonner";

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

// New mutation hook to suspend candidate
export const useSuspendCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidateStats"] });
      toast.success("Candidate suspended successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to suspend candidate: ${error.message}`);
    },
  });
};

export const useRetrieveCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retrieveCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidateStats"] });
      toast.success("Candidate account reactivated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to reactivate candidate: ${error.message}`);
    },
  });
};
