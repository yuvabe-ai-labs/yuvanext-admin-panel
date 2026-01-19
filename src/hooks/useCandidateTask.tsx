import { useQuery } from "@tanstack/react-query";
import { getTasksByApplicationId } from "@/services/candidateTasks.service";

export const useTasksByApplicationId = (applicationId?: string) => {
  return useQuery({
    queryKey: ["tasks", applicationId],
    queryFn: () => getTasksByApplicationId(applicationId as string),
    enabled: !!applicationId,
  });
};
