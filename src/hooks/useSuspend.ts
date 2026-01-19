import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    activateInternship,
    activateUnitAccount,
    deactivateInternship,
    deactivateUnitAccount,
} from "@/services/suspend.service";
import type { Account } from "@/services/suspend.service";

export const useDeactivateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<Account, Error, string>({
        mutationFn: (unitId: string) => deactivateUnitAccount(unitId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["units"],
            });
        },
    });
};

export const useActivateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<Account, Error, string>({
        mutationFn: (unitId: string) => activateUnitAccount(unitId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["units"],
            });
        },
    });
};

export const useDisableInternship = () => {
    const queryClient = useQueryClient();

    return useMutation<Account, Error, string>({
        mutationFn: (internshipId: string) =>
            deactivateInternship(internshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["internships"],
            });
        },
    });
};

export const useEnableInternship = () => {
    const queryClient = useQueryClient();

    return useMutation<Account, Error, string>({
        mutationFn: (internshipId: string) => activateInternship(internshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["internships"],
            });
        },
    });
};
