import axiosInstance from "@/config/platform-api";
import { handleApiError, handleApiResponse } from "@/lib/api-handler";

export interface Account {
  userId: string;
  accountDisabled: boolean;
  message: string;
}

export const deactivateUnitAccount = async (
  Id: string,
): Promise<Account> => {
  try {
    const response = await axiosInstance.patch(
      `/admin/units/${Id}/deactivate`,
    );

    return handleApiResponse<Account>(response, {} as Account);
  } catch (error) {
    return handleApiError(error, "Failed to deactivate account");
  }
};

export const activateUnitAccount = async (
  Id: string,
): Promise<Account> => {
  try {
    const response = await axiosInstance.patch(
      `/admin/units/${Id}/activate`,
    );

    return handleApiResponse<Account>(response, {} as Account);
  } catch (error) {
    return handleApiError(error, "Failed to activate account");
  }
};

export const activateInternship = async (
  Id: string,
): Promise<Account> => {
  try {
    const response = await axiosInstance.patch(
      `/admin/internships/${Id}/enable`,
    );

    return handleApiResponse<Account>(response, {} as Account);
  } catch (error) {
    return handleApiError(error, "Failed to activate internship");
  }
};

export const deactivateInternship = async (
  Id: string,
): Promise<Account> => {
  try {
    const response = await axiosInstance.patch(
      `/admin/internships/${Id}/disable`,
    );

    return handleApiResponse<Account>(response, {} as Account);
  } catch (error) {
    return handleApiError(error, "Failed to deactivate internship");
  }
};
