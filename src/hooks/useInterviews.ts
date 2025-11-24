import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getScheduledInterviews,
  getInterviewStats,
  cancelInterview,
} from "@/services/interview.service";
import { toast } from "sonner";

export const useScheduledInterviews = (page: number = 1, searchQuery: string = "") => {
  return useQuery({
    queryKey: ["scheduledInterviews", page, searchQuery],
    queryFn: () => getScheduledInterviews(page, searchQuery),
  });
};

export const useInterviewStats = () => {
  return useQuery({
    queryKey: ["interviewStats"],
    queryFn: getInterviewStats,
  });
};

export const useCancelInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledInterviews"] });
      queryClient.invalidateQueries({ queryKey: ["interviewStats"] });
      toast.success("Interview cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel interview: ${error.message}`);
    },
  });
};