import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInternship,
  generateAIInternshipContent,
  getInternshipById,
  getInternships,
} from "@/services/internship.service";
import type {
  AIGenerateRequest,
  CreateInternshipPayload,
  GetInternshipsParams,
} from "@/types/internship.types";

export const useInternshipById = (id: string) => {
  return useQuery({
    queryKey: ["internship-byid", id],
    queryFn: () => getInternshipById(id),
    enabled: !!id,
  });
};

export const useInternships = (params: GetInternshipsParams = {}) => {
  return useQuery({
    queryKey: ["internships", params],
    queryFn: () => getInternships(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateInternship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInternshipPayload) => createInternship(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
    },
  });
};

export const useGenerateAIContent = () => {
  return useMutation({
    mutationFn: (payload: AIGenerateRequest) =>
      generateAIInternshipContent(payload),
  });
};
