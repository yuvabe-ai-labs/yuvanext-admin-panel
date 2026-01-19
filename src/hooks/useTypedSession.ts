import { useSession } from "@/lib/auth-client";

export interface TypedSessionUser {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    role?: "admin";
}

export interface TypedSession {
    user: TypedSessionUser;
}

export const useTypedSession = () => {
    const { data, isPending, error } = useSession();

    return {
        data: data as (TypedSession & { user: TypedSessionUser }) | null,
        isPending,
        error,
    };
};
