import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllInternships, 
  getActiveJobCount, 
  getTotalApplications, 
  suspendInternship,
  getInternshipById 
} from "@/services/internship.service";
import { toast } from "sonner";

export const useInternships = (page: number = 1, searchQuery: string = "") => {
  return useQuery({
    queryKey: ["internships", page, searchQuery],
    queryFn: () => getAllInternships(page, searchQuery),
  });
};

export const useActiveJobCount = () => {
  return useQuery({
    queryKey: ["activeJobCount"],
    queryFn: getActiveJobCount,
  });
};

export const useTotalApplications = () => {
  return useQuery({
    queryKey: ["totalApplications"],
    queryFn: getTotalApplications,
  });
};

export const useSuspendInternship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (internshipId: string) => suspendInternship(internshipId),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["internships"] });
      queryClient.invalidateQueries({ queryKey: ["activeJobCount"] });
      
      // Show success notification
      toast.success("Internship suspended successfully");
    },
    onError: (error: Error) => {
      // Show error notification
      toast.error(`Failed to suspend internship: ${error.message}`);
    },
  });
};

export const useInternshipById = (internshipId: string) => {
  return useQuery({
    queryKey: ["internship", internshipId],
    queryFn: () => getInternshipById(internshipId),
    enabled: !!internshipId,
  });
};