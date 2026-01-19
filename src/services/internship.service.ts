import axiosInstance from "@/config/platform-api";
import type {
  AIGenerateRequest,
  AIGenerateResponse,
  CreateInternshipPayload,
  GetInternshipsParams,
  Internship,
  InternshipDetailsView,
  PaginatedInternshipData,
} from "@/types/internship.types";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

export const getInternshipById = async (
  id: string,
): Promise<InternshipDetailsView> => {
  try {
    const response = await axiosInstance.get(`/internships/${id}`);
    return handleApiResponse<InternshipDetailsView>(
      response,
      {} as InternshipDetailsView,
    );
  } catch (error) {
    return handleApiError(error, `Failed to fetch internship ${id}`);
  }
};

export const getInternships = async (
  params: GetInternshipsParams = {},
): Promise<PaginatedInternshipData> => {
  try {
    const response = await axiosInstance.get("/admin/internships", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status,
      },
    });

    // Use standard handler for the internship array
    const internships = handleApiResponse<Internship[]>(response, []);

    // Return both the data and the pagination sibling from the response
    return {
      internships,
      pagination: response.data.pagination,
    };
  } catch (error) {
    return handleApiError(error, "Failed to fetch internships");
  }
};

export const createInternship = async (
  payload: CreateInternshipPayload,
): Promise<InternshipDetailsView> => {
  try {
    const response = await axiosInstance.post("/internships", payload);
    return handleApiResponse<InternshipDetailsView>(
      response,
      {} as InternshipDetailsView,
    );
  } catch (error) {
    return handleApiError(error, "Failed to create internship");
  }
};

export const generateAIInternshipContent = async (
  payload: AIGenerateRequest,
): Promise<AIGenerateResponse> => {
  try {
    const response = await axiosInstance.post(
      "/unit/ai/generate-content",
      payload,
    );
    return handleApiResponse<AIGenerateResponse>(
      response,
      {} as AIGenerateResponse,
    );
  } catch (error) {
    return handleApiError(error, "Failed to generate AI content");
  }
};
